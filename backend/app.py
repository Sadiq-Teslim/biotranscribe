from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import uuid
from datetime import datetime
import os
import time

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend

# Database Configuration via Environment Variables
def get_db_config():
    # TiDB Cloud requires SSL. mysql-connector-python usually handles this automatically
    # if the server enforces it, but we explicitely default to the 'test' database
    # which is standard in TiDB Serverless.
    return {
        'user': os.environ.get('DB_USER', 'root'),
        'password': os.environ.get('DB_PASSWORD', 'password'),
        'host': os.environ.get('DB_HOST', 'localhost'), 
        'database': os.environ.get('DB_NAME', 'test'), # Changed default to 'test'
        'port': int(os.environ.get('DB_PORT', 3306)),
        # 'ssl_disabled': False # Ensure SSL is used (default is usually fine)
    }

def get_db_connection():
    config = get_db_config()
    try:
        conn = mysql.connector.connect(**config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

@app.route('/')
def home():
    return "BioTranscribe API is running"

@app.route('/health')
def health():
    conn = get_db_connection()
    if conn:
        conn.close()
        return jsonify({"status": "healthy", "database": "connected"}), 200
    # Provide more detail on why it failed
    try:
        config = get_db_config()
        # Don't expose password in logs/response
        config['password'] = '******'
        return jsonify({
            "status": "unhealthy", 
            "database": "disconnected", 
            "config_attempted": config
        }), 500
    except:
        return jsonify({"status": "unhealthy", "database": "disconnected"}), 500

# --- CRUD Operations ---

# READ: Get all history records
@app.route('/api/history', methods=['GET'])
def get_history():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT * FROM history_records ORDER BY date DESC')
        results = cursor.fetchall()
        for row in results:
            if row['date']:
                row['date'] = row['date'].isoformat()
            if row['created_at']:
                row['created_at'] = row['created_at'].isoformat()
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# CREATE: Add a new record
@app.route('/api/history', methods=['POST'])
def add_record():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
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
        data.get('name', 'Untitled'),
        data.get('type', 'DNA'),
        data.get('inputSequence', ''),
        data.get('rnaSequence', ''),
        data.get('proteinSequenceString', ''),
        data.get('aiAnalysis'),
        current_time
    )
    
    try:
        cursor.execute(query, values)
        conn.commit()
        return jsonify({'id': record_id, 'message': 'Record saved successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# DELETE: Remove a record
@app.route('/api/history/<id>', methods=['DELETE'])
def delete_record(id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM history_records WHERE id = %s', (id,))
        conn.commit()
        return jsonify({'message': 'Deleted successfully'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    # Use environment variable to control debug mode for production
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
