# BioTranscribe

An intelligent web application for the Central Dogma of molecular biology. Convert DNA sequences to RNA and translate them into proteins with real-time visualization.

![BioTranscribe](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **DNA Transcription**: Seamless conversion of DNA strands into messenger RNA (mRNA) with real-time visualization
- **RNA Translation**: Instant decoding of mRNA triplets into amino acid chains using the standard genetic code
- **History Management**: Save and manage your transcription/translation history with persistent storage
- **Modern UI**: Beautiful, responsive interface built with React, TypeScript, and Framer Motion

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for navigation
- **Framer Motion** for smooth animations
- **Lucide React** for icons
- **Tailwind CSS** for styling

### Backend
- **Flask** (Python) REST API
- **MySQL/TiDB** for persistent data storage
- **Flask-CORS** for cross-origin resource sharing

### AI Integration
- **Google Gemini API** for protein analysis

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MySQL** via **TiDB Cloud** database

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Sadiq-Teslim/biotranscribe.git
cd biotranscribe
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and add your Gemini API key
# GEMINI_API_KEY=your_api_key_here
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and configure your database connection
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# DB_HOST=your_db_host
# DB_NAME=test
# DB_PORT=3306
```

### 4. Database Setup

Run the SQL schema to create the necessary tables:

```bash
# Connect to your MySQL/TiDB database and run:
mysql -u your_user -p your_database < backend/schema.sql

# Or manually execute the SQL in backend/schema.sql
```

## Running the Application

### Development Mode

1. **Start the Backend** (in `backend/` directory):

```bash
python app.py
```

The backend will run on `http://localhost:5000`

2. **Start the Frontend** (in root directory):

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Production Build

1. **Build the Frontend**:

```bash
npm run build
```

The production build will be in the `dist/` directory.

2. **Run the Backend in Production**:

```bash
# Using Gunicorn (recommended)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Or using Flask's built-in server (not recommended for production)
python app.py
```

## Configuration

### Frontend Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=test
DB_PORT=3306
```

For TiDB Cloud, use your TiDB Cloud connection details.

### API Configuration

Update `services/storageService.ts` to configure the backend API URL:

```typescript
// For local development
const API_URL = 'http://localhost:5000/api';

// For production (replace with your backend URL)
const API_URL = 'https://your-backend-url.com/api';
```

## Project Structure

```
biotranscribe/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── schema.sql          # Database schema
├── components/
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── SequenceVisualizer.tsx
├── pages/
│   ├── About.tsx
│   ├── Architecture.tsx
│   ├── History.tsx
│   ├── Home.tsx
│   └── Translator.tsx
├── services/
│   ├── bioService.ts       # DNA/RNA/Protein conversion logic
│   ├── geminiService.tsx   # Google Gemini AI integration
│   └── storageService.ts   # History storage (API/LocalStorage)
├── App.tsx                 # Main app component
├── constants.ts            # Genetic code constants
├── types.ts                # TypeScript type definitions
└── vite.config.ts         # Vite configuration
```

## API Endpoints

### Backend API

- `GET /health` - Health check endpoint
- `GET /api/history` - Retrieve all history records
- `POST /api/history` - Save a new transcription/translation record
- `DELETE /api/history/<id>` - Delete a history record

## Usage

1. Navigate to the **Translator** page
2. Enter a DNA sequence (e.g., `ATGCGATCG`)
3. The app will automatically:
   - Transcribe DNA to RNA
   - Translate RNA to protein
   - Display the results with visualizations
4. Click **Analyze with AI** to get protein structure and function predictions
5. Save your work to history for later reference

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- AI analysis powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Genetic code data based on the standard codon table

## Support

For issues, questions, or contributions, please open an issue on [GitHub](https://github.com/Sadiq-Teslim/biotranscribe/issues).

---

**Made with ❤️ for the bioinformatics community**

