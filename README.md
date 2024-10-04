
---

# Quizz - Real-time Multiplayer Quiz Application

## Overview

**Quizz** is a real-time multiplayer quiz platform designed for users to create and join quiz rooms, compete on various topics, and track their performance on live leaderboards. Built using the **MERN stack** (MongoDB, Express, React, Node.js), this application enables seamless interaction among multiple players in real-time, providing a fun and interactive experience.

**Live Demo:** [Quizz Live Link](https://quizz-ten-eta.vercel.app/login)

## Features

- **User Authentication & Authorization:**
  - Secure user authentication using **JWT (JSON Web Tokens)** and **BcryptJS** for password hashing.
  - Authorization required for creating rooms and joining quizzes.

- **Room Creation & Quiz Categories:**
  - Users can create quiz rooms based on selected categories, difficulty levels, and the number of questions.
  - Other users can join existing rooms to participate in the quiz.

- **Real-time Quiz Gameplay:**
  - Players can answer questions in real-time and compete with others in the same room.
  - Live score tracking and leaderboard updates as players submit answers.

- **Leaderboard:**
  - Real-time leaderboard showing scores from all rooms.
  - Players' performance is tracked and ranked based on their quiz scores.

- **State Management with Redux:**
  - **Redux** is used for managing global state, such as user authentication status and quiz room information.
  - Conditional rendering based on user roles (player/admin) and authentication state.

- **Backend API with Express.js:**
  - APIs for creating rooms, fetching questions, submitting answers, and calculating scores.
  - Robust backend developed using **Node.js** and **Express.js**, ensuring smooth quiz flow.

- **Database:**
  - **MongoDB Atlas** is used for storing user data, quiz rooms, questions, and leaderboard information.
  - **Mongoose** ODM (Object Data Modeling) provides schema-based models for the database.

## Tech Stack

### Frontend:
- **React (Vite)**: Fast, modern React setup using Vite for optimized performance.
- **React-Bootstrap**: Used for designing a responsive and intuitive user interface.
- **Redux Toolkit**: Efficient state management for authentication, quiz rooms, and leaderboard features.
- **Axios**: For making API requests to the backend.

### Backend:
- **Node.js & Express.js**: For server-side logic, quiz functionality, and API routing.
- **JWT & BcryptJS**: Secure user authentication and authorization.
- **MongoDB & Mongoose**: NoSQL database for data storage with Mongoose for schema modeling and data validation.

### Database:
- **MongoDB Atlas**: Cloud-based database for storing users, quiz rooms, questions, and scores.

## Installation

### Prerequisites
- **Node.js**: Ensure you have Node.js installed. Download it [here](https://nodejs.org/).
- **MongoDB Atlas**: You need a MongoDB instance to store user data, quiz rooms, and leaderboard scores. You can set up a free cloud instance using MongoDB Atlas.

### Clone the Repository:

```bash
git clone https://github.com/Harshith014/quizz.git
cd quizz
```

### Environment Variables

Both the **frontend** and **backend** require `.env` files to store sensitive information such as JWT secret keys, MongoDB URI, etc. Refer to the `.env.example` files provided in each folder and modify them with your credentials.

### Backend Setup

Navigate to the backend folder and install the necessary dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```bash
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<your JWT secret>
```

Start the backend server:

```bash
node server.js
```

### Frontend Setup

Navigate to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory and add any required environment variables (e.g., API base URL, frontend-specific settings). You can follow the structure from the `.env.example` file provided in the repository.

To start the React development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

## Usage

1. **User Authentication:**
   - Register or log in to access the quiz rooms and leaderboard features.
   - JWT-based session management ensures secure access to the platform.

2. **Creating Rooms:**
   - Users can create quiz rooms by selecting the question category, difficulty level, and number of questions.
   - Invite other users to join the room and participate in the quiz.

3. **Joining a Quiz:**
   - Players can join existing rooms by entering the room code.
   - Once all players are ready, the quiz will begin with real-time question answering.

4. **Leaderboard & Scoring:**
   - Scores are calculated in real-time as players submit their answers.
   - The leaderboard is updated dynamically with players’ scores from all active rooms.



## Key Dependencies

### Backend:
- **Express.js**: For API routing and handling HTTP requests.
- **MongoDB & Mongoose**: NoSQL database and schema-based data modeling.
- **JWT & BcryptJS**: For secure authentication and password handling.
- **Axios**: For making API requests to the backend.
  
### Frontend:
- **React.js**: For building the user interface and quiz room functionality.
- **Vite**: Fast development tool for React.
- **Redux Toolkit**: For managing global state, such as user authentication, room data, and quiz progress.
- **React-Bootstrap**: For designing responsive UI components.
- **Axios**: For sending and receiving data from the backend.



---

