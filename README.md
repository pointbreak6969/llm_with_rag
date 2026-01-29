# 🤖 LLM with RAG - AI-Powered Document Chat Application

A full-stack Retrieval-Augmented Generation (RAG) application that enables users to chat with their documents using local LLM models. The system intelligently retrieves relevant information from uploaded documents and generates accurate, context-aware responses.

![Application Banner]
<!-- Upload: Screenshot of the main landing page or application logo -->

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **🔍 RAG-Powered Chat**: Query documents using natural language and get accurate, context-aware responses
- **📄 Multi-Format Support**: Process PDF and DOCX documents
- **🧠 Local LLM Integration**: Powered by Ollama (Llama 3.1) for privacy-focused AI processing
- **⚡ FAISS Vector Search**: Lightning-fast semantic search using Facebook's FAISS library
- **📚 Document Management**: Upload and manage multiple documents for knowledge retrieval

### User Features
- **🔐 User Authentication**: Secure registration and login with NextAuth.js
- **💬 Interactive Chat Interface**: Clean, responsive chat UI with markdown support
- **🎯 Source Attribution**: Every answer includes citations to source documents
- **💎 Tiered Access**: Free and paid tiers with different document access levels
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

![Chat Interface]
<!-- Upload: Screenshot of the chat interface showing a question and AI-generated response with sources -->

## 🏗️ Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Next.js        │◄───────►│  Flask API      │◄───────►│  Ollama LLM     │
│  Frontend       │   HTTP  │  Backend        │         │  (Llama 3.1)    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│  MongoDB        │         │  FAISS Index    │
│  (User Data)    │         │  (Embeddings)   │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
```

### Data Flow
1. User uploads documents → Backend processes and creates embeddings → Stored in FAISS index
2. User asks question → System retrieves relevant chunks → LLM generates answer → Response returned
3. Authentication → NextAuth.js manages sessions → MongoDB stores user data

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Lucide Icons
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js 4.24
- **HTTP Client**: Axios
- **Markdown**: react-markdown

### Backend
- **Framework**: Flask (Python)
- **LLM**: Ollama (Llama 3.1)
- **Embeddings**: sentence-transformers (all-MiniLM-L6-v2)
- **Vector Database**: FAISS (CPU)
- **LangChain**: Core, Community, Ollama integrations
- **Document Processing**: PyMuPDF, docx2txt
- **CORS**: Flask-CORS

### Database & Storage
- **Database**: MongoDB (via Mongoose)
- **Vector Store**: FAISS local index files
- **Environment**: python-dotenv

![System Architecture Diagram]
<!-- Upload: A diagram showing the complete system architecture with all components -->

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **Ollama** with Llama 3.1 model
- **Git**

### Installing Ollama

1. Download and install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the Llama 3.1 model:
   ```bash
   ollama pull llama3.1
   ```
3. Verify installation:
   ```bash
   ollama list
   ```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/llm_with_rag.git
cd llm_with_rag
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create data directory for documents
mkdir data
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
# or
yarn install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1

# FAISS Configuration
FAISS_INDEX_PATH=./faiss.index
FAISS_DOCX_INDEX_PATH=./faiss_docx.index
EMBEDDING_MODEL=all-MiniLM-L6-v2

# Document Storage
DATA_DIRECTORY=./data
```

### Frontend Configuration

Create a `.env.local` file in the `frontend` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/llm_rag_db
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-generate-a-random-string

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## 🎯 Usage

### Starting the Application

#### 1. Start Ollama (if not running)

```bash
ollama serve
```

#### 2. Start Backend Server

```bash
cd backend
source .venv/Scripts/activate  # Windows
# source .venv/bin/activate    # macOS/Linux

python run.py
```

The backend will start on `http://localhost:5000`

#### 3. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Ingesting Documents

To add documents to the RAG system:

1. Place PDF or DOCX files in `backend/data/` directory
2. Run the ingestion script:

```bash
cd backend
python ingest.py  # For PDF documents
# or
python docx_ingest.py  # For DOCX documents
```

This will:
- Process all documents in the data directory
- Create text chunks with overlap
- Generate embeddings using sentence-transformers
- Store vectors in FAISS index

![Document Upload Process]
<!-- Upload: Screenshot or diagram showing the document ingestion workflow -->

### Using the Chat Interface

1. **Register/Login**: Create an account or sign in
2. **Navigate to Chat**: Click on "Chat" in the navigation
3. **Ask Questions**: Type your question about the uploaded documents
4. **View Responses**: Get AI-generated answers with source citations
5. **Explore Sources**: Click on source files to see which documents were used

![Chat Example]
<!-- Upload: Screenshot showing a complete chat interaction with question, answer, and sources -->

## 📁 Project Structure

```
llm_with_rag/
├── backend/                      # Python Flask backend
│   ├── app.py                   # Main Flask application
│   ├── run.py                   # Application entry point
│   ├── ingest.py               # PDF document ingestion
│   ├── docx_ingest.py          # DOCX document ingestion
│   ├── tools.py                # Utility functions
│   ├── requirements.txt        # Python dependencies
│   ├── faiss.index            # FAISS vector index (PDF)
│   ├── faiss_docx.index       # FAISS vector index (DOCX)
│   └── data/                  # Document storage directory
│
├── frontend/                     # Next.js frontend
│   ├── src/
│   │   ├── app/               # Next.js app router pages
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── chat/          # Chat interface
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Registration page
│   │   │   ├── pricing/       # Pricing page
│   │   │   └── api/           # API routes
│   │   │       ├── auth/      # NextAuth configuration
│   │   │       └── register/  # Registration endpoint
│   │   │
│   │   ├── components/        # React components
│   │   │   ├── chat.tsx      # Chat component
│   │   │   ├── Home.tsx      # Home component
│   │   │   ├── Navbar.tsx    # Navigation bar
│   │   │   └── ui/           # UI components (button, card, input)
│   │   │
│   │   ├── context/          # React context providers
│   │   │   └── AuthProvider.tsx
│   │   │
│   │   ├── lib/              # Utilities and configs
│   │   │   ├── connectDb.ts  # MongoDB connection
│   │   │   └── utils.ts      # Helper functions
│   │   │
│   │   ├── models/           # Database models
│   │   │   └── user.model.ts # User schema
│   │   │
│   │   ├── schemas/          # Validation schemas
│   │   │   ├── loginSchema.ts
│   │   │   └── signUpSchema.ts
│   │   │
│   │   └── types/            # TypeScript definitions
│   │       └── next-auth.d.ts
│   │
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   └── next.config.ts        # Next.js configuration
│
└── README.md                 # This file
```

## 🔌 API Endpoints

### Backend API

#### `GET /`
Health check endpoint
```json
Response: "hello"
```

#### `POST /query`
Free tier query endpoint (PDF documents only)

**Request:**
```json
{
  "query": "What is machine learning?"
}
```

**Response:**
```json
{
  "topic": "Machine Learning",
  "answer": "Machine learning is...",
  "sources": "document1.pdf, document2.pdf"
}
```

#### `POST /paidQuery`
Paid tier query endpoint (PDF + DOCX documents)

**Request:**
```json
{
  "query": "Explain neural networks"
}
```

**Response:**
```json
{
  "topic": "Neural Networks",
  "answer": "# Neural Networks\n\nNeural networks are...",
  "sources": "document1.pdf, notes.docx"
}
```

### Frontend API Routes

#### `POST /api/register`
User registration endpoint

#### `POST /api/auth/[...nextauth]`
NextAuth authentication endpoints (signin, signout, session)

![API Flow Diagram]
<!-- Upload: Diagram showing the API request/response flow -->

## 🔐 Authentication

The application uses **NextAuth.js** for authentication with the following features:

- **Credentials Provider**: Email and password authentication
- **Google OAuth**: (Optional) Sign in with Google
- **Session Management**: JWT-based sessions
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Password Hashing**: bcrypt for secure password storage

### User Model Schema

```typescript
{
  username: string (unique)
  email: string (unique)
  password: string (hashed)
  createdAt: Date
  updatedAt: Date
}
```

### Adding Protected Routes

Wrap components with session check:

```tsx
import { useSession } from "next-auth/react"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <div>Loading...</div>
  if (status === "unauthenticated") redirect("/login")
  
  return <div>Protected Content</div>
}
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Test document ingestion
python ingest.py

# Test Flask server
python run.py

# Test query endpoint
curl -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test question"}'
```

### Frontend Testing

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## 🎨 Customization

### Changing LLM Model

Edit `backend/app.py`:

```python
model = ChatOllama(model="mistral")  # Change to any Ollama model
```

### Adjusting Chunk Size

Edit `backend/ingest.py`:

```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1500,      # Increase for larger chunks
    chunk_overlap=300,    # Adjust overlap
)
```

### Modifying UI Theme

Edit `frontend/src/app/globals.css` for Tailwind theme customization.

## 🐛 Troubleshooting

### Common Issues

**Ollama Connection Error**
```bash
# Ensure Ollama is running
ollama serve

# Check if model is available
ollama list
```

**MongoDB Connection Failed**
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env.local`
- Ensure database user has proper permissions

**FAISS Index Not Found**
- Run ingestion script: `python ingest.py`
- Ensure documents exist in `backend/data/`

**CORS Errors**
- Verify backend CORS configuration in `app.py`
- Ensure frontend proxy settings are correct

![Troubleshooting Guide]
<!-- Upload: Screenshot of common error messages and their solutions -->

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Add `Procfile`:
   ```
   web: python run.py
   ```

2. Set environment variables on your platform
3. Upload FAISS index files or configure document ingestion

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel deploy
```

Configure environment variables in Vercel dashboard.

## 📈 Performance Optimization

- **Caching**: Implement Redis for query caching
- **Batch Processing**: Process multiple queries concurrently
- **Index Optimization**: Use GPU-accelerated FAISS for faster searches
- **CDN**: Serve static assets via CDN
- **Database Indexing**: Add MongoDB indexes on frequently queried fields

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- **Ollama** - Local LLM runtime
- **LangChain** - LLM orchestration framework
- **FAISS** - Efficient similarity search
- **Next.js** - React framework
- **Sentence Transformers** - Text embeddings

## 📞 Support

For support, email support@yourdomain.com or open an issue on GitHub.

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Document highlights in responses
- [ ] Conversation history
- [ ] Collaborative document annotation
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Self-hosted option with Docker Compose

---

**Made with ❤️ using Next.js, Flask, and Ollama**

![Footer Image]
<!-- Upload: A visually appealing footer image or project logo -->
