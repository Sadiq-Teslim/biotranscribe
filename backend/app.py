from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import uuid
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend


# Database Configuration via Environment Variables
def get_db_config():
    # TiDB Cloud requires SSL. mysql-connector-python usually handles this automatically
    # if the server enforces it, but we explicitely default to the 'test' database
    # which is standard in TiDB Serverless.
    return {
        "user": os.environ.get("DB_USER", "root"),
        "password": os.environ.get("DB_PASSWORD", "password"),
        "host": os.environ.get("DB_HOST", "localhost"),
        "database": os.environ.get("DB_NAME", "test"),  # Changed default to 'test'
        "port": int(os.environ.get("DB_PORT", 3306)),
        # 'ssl_disabled': False # Ensure SSL is used (default is usually fine)
    }


def get_db_connection():
    config = get_db_config()
    # Don't log password in production
    log_config = {k: ("******" if k == "password" else v) for k, v in config.items()}
    print(f"Attempting database connection with config: {log_config}")
    try:
        conn = mysql.connector.connect(**config)
        print("Database connection successful")
        return conn
    except mysql.connector.Error as err:
        print(f"ERROR: Database connection failed: {err}")
        print(f"Error code: {err.errno}, SQL state: {err.sqlstate}")
        import traceback

        traceback.print_exc()
        return None
    except Exception as e:
        print(f"ERROR: Unexpected error during database connection: {e}")
        import traceback

        traceback.print_exc()
        return None


@app.route("/")
def home():
    return "BioTranscribe API is running"


@app.route("/health")
def health():
    conn = get_db_connection()
    if conn:
        # Test if we can query the database and check if table exists
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")

            # Check if history_records table exists
            cursor.execute(
                """
                SELECT COUNT(*) as count 
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name = 'history_records'
            """
            )
            table_exists = cursor.fetchone()[0] > 0

            cursor.close()
            conn.close()

            return (
                jsonify(
                    {
                        "status": "healthy",
                        "database": "connected",
                        "table_exists": table_exists,
                    }
                ),
                200,
            )
        except Exception as e:
            if conn:
                conn.close()
            return (
                jsonify(
                    {
                        "status": "unhealthy",
                        "database": "connected but query failed",
                        "error": str(e),
                    }
                ),
                500,
            )
    # Provide more detail on why it failed
    try:
        config = get_db_config()
        # Don't expose password in logs/response
        config["password"] = "******"
        return (
            jsonify(
                {
                    "status": "unhealthy",
                    "database": "disconnected",
                    "config_attempted": config,
                }
            ),
            500,
        )
    except Exception as e:
        return (
            jsonify(
                {"status": "unhealthy", "database": "disconnected", "error": str(e)}
            ),
            500,
        )


# --- CRUD Operations ---


# Helper function to ensure table exists
def ensure_table_exists(conn):
    """Create history_records table if it doesn't exist"""
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS history_records (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(10) NOT NULL,
                input_sequence TEXT NOT NULL,
                rna_sequence TEXT NOT NULL,
                protein_sequence TEXT NOT NULL,
                ai_analysis TEXT,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )
        conn.commit()
        print("Table 'history_records' ensured to exist")
    except Exception as e:
        print(f"ERROR creating table: {e}")
        raise
    finally:
        cursor.close()


# READ: Get all history records
@app.route("/api/history", methods=["GET"])
def get_history():
    conn = get_db_connection()
    if not conn:
        error_msg = (
            "Database connection failed. Please check your database credentials."
        )
        print(f"ERROR: {error_msg}")
        return jsonify({"error": error_msg}), 500

    # Ensure table exists before querying
    try:
        ensure_table_exists(conn)
    except Exception as e:
        conn.close()
        error_msg = f"Failed to ensure table exists: {str(e)}"
        print(f"ERROR: {error_msg}")
        return jsonify({"error": error_msg}), 500

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM history_records ORDER BY date DESC")
        results = cursor.fetchall()
        for row in results:
            if row.get("date"):
                row["date"] = row["date"].isoformat()
            if row.get("created_at"):
                row["created_at"] = row["created_at"].isoformat()
        print(f"Successfully fetched {len(results)} history records")
        return jsonify(results)
    except mysql.connector.Error as db_err:
        error_msg = f"Database error: {str(db_err)}"
        print(f"ERROR: {error_msg}")
        return jsonify({"error": error_msg}), 500
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        print(f"ERROR: {error_msg}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": error_msg}), 500
    finally:
        cursor.close()
        conn.close()


# CREATE: Add a new record
@app.route("/api/history", methods=["POST"])
def add_record():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    # Ensure table exists before inserting
    try:
        ensure_table_exists(conn)
    except Exception as e:
        conn.close()
        error_msg = f"Failed to ensure table exists: {str(e)}"
        print(f"ERROR: {error_msg}")
        return jsonify({"error": error_msg}), 500

    cursor = conn.cursor()
    record_id = str(uuid.uuid4())
    current_time = datetime.now()

    query = """
        INSERT INTO history_records 
        (id, name, type, input_sequence, rna_sequence, protein_sequence, ai_analysis, date) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        record_id,
        data.get("name", "Untitled"),
        data.get("type", "DNA"),
        data.get("inputSequence", ""),
        data.get("rnaSequence", ""),
        data.get("proteinSequenceString", ""),
        data.get("aiAnalysis"),
        current_time,
    )

    try:
        cursor.execute(query, values)
        conn.commit()
        print(f"Successfully saved record with id: {record_id}")
        return jsonify({"id": record_id, "message": "Record saved successfully"}), 201
    except Exception as e:
        print(f"ERROR saving record: {e}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# DELETE: Remove a record
@app.route("/api/history/<id>", methods=["DELETE"])
def delete_record(id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    # Ensure table exists before deleting
    try:
        ensure_table_exists(conn)
    except Exception as e:
        conn.close()
        error_msg = f"Failed to ensure table exists: {str(e)}"
        print(f"ERROR: {error_msg}")
        return jsonify({"error": error_msg}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM history_records WHERE id = %s", (id,))
        conn.commit()
        print(f"Successfully deleted record with id: {id}")
        return jsonify({"message": "Deleted successfully"}), 200
    except Exception as e:
        print(f"ERROR deleting record: {e}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    # Use environment variable to control debug mode for production
    debug_mode = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    app.run(debug=debug_mode, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
