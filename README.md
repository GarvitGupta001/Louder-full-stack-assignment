# Louder Full Stack Assignment

A full-stack AI-powered event planning application. Describe your event in plain language and get instant venue recommendations, cost estimates, and detailed justifications.
## Live Link
[View Live Application](https://louder-full-stack-assignment.vercel.app/)

## Project Structure

```
├── backend/      # Node.js + Express + MongoDB API
└── frontend/     # React + Vite + Tailwind CSS
```

## Prerequisites

Make sure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string)

## Backend Setup

1. Navigate to the backend folder:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend/` folder:

    ```bash
    cp .env.sample .env
    ```

    Then open `.env` and fill in your values:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/
    JWT_SECRET=your_jwt_secret_here
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```
    The backend will be running at **http://localhost:3000**
    
## Frontend Setup

1. Open a new terminal and navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend/` folder:

    ```bash
    cp .env.sample .env
    ```

    Then open `.env` and set the backend URL:

    ```env
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running at **http://localhost:5173**

## Running Both Simultaneously

Open two terminal windows and run them side by side:

| Terminal 1 (Backend) | Terminal 2 (Frontend) |
| -------------------- | --------------------- |
| `cd backend`         | `cd frontend`         |
| `npm run dev`        | `npm run dev`         |

Then open **http://localhost:5173** in your browser.
