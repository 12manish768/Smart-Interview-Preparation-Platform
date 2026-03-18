# SmartPrep AI: AI-Powered Interview Preparation Platform

![SmartPrep AI Dashboard](https://img.shields.io/badge/AI-Interviews-indigo)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-green)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange)

SmartPrep AI is a high-impact, full-stack platform designed to help candidates ace technical and behavioral interviews. It leverages Google's Gemini AI to provide real-time, context-aware mock interviews and detailed performance analytics.

## 🚀 Key Features

- **JWT Authentication**: Secure stateless authentication for candidate profiles.
- **Dynamic Interview Sessions**: Select topics like Java, DSA, System Design, or HR and choose difficulty levels.
- **AI Interviewer Core**: Real-time chat loop with Gemini AI that adapts to your previous answers.
- **Performance Analytics**: Radar charts and actionable feedback reports (Strengths, Weaknesses, Tips).
- **Session History**: Track your progress over time with a clean dashboard.

## 🛠️ Tech Stack

### Backend
- **Java 21** & **Spring Boot 3.2**
- **Spring Security** (JWT)
- **Spring Data JPA** (PostgreSQL)
- **Google Gemini API** (via RestTemplate)
- **Lombok** & **Validation**

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (Premium UI/UX)
- **Lucide React** (Icons)
- **Recharts** (Data Visualization)
- **Axios** (With JWT Interceptors)

## 📦 Project Structure

```text
├── src/main/java/com/interview/platform/
│   ├── controller/      # API Endpoints
│   ├── service/         # Business Logic & Gemini Integration
│   ├── repository/      # JPA Data Access
│   ├── model/           # JPA Entities
│   ├── config/          # Security & App Config
│   └── dto/             # Data Transfer Objects
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios Configuration
│   │   ├── components/  # Reusable UI Elements
│   │   ├── pages/       # Dashboard, Interview, Evaluation
│   │   ├── context/     # Auth Context
│   └── tailwind.config.js
└── pom.xml              # Maven Dependencies
```

## 🚦 Getting Started

### Prerequisites
- JDK 21+
- PostgreSQL
- Node.js & npm
- Gemini API Key ([Get it here](https://aistudio.google.com/))

### Backend Setup
1. Configure `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/interview_db
       username: your_username
       password: your_password
   gemini:
     apiKey: YOUR_GEMINI_API_KEY
   ```
2. Run with Maven:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## 📝 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Authenticate and get token

### Interviews
- `GET /api/v1/interviews/history` - Fetch user's past sessions
- `POST /api/v1/interviews/start` - Initialize a new session
- `POST /api/v1/interviews/{id}/next` - Get next AI question
- `POST /api/v1/interviews/{id}/answer` - Submit user response
- `POST /api/v1/interviews/{id}/end` - Generate evaluation report

## 📄 License
This project is licensed under the MIT License.
