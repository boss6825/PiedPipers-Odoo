# StackIt - Q&A Forum Platform

StackIt is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It's designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.

## Features

- User authentication (register, login)
- Ask questions with rich text formatting
- Answer questions with rich text formatting
- Upvote/downvote answers
- Accept answers
- Tag questions for better organization
- Notification system for user interactions

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
├── backend/
│   ├── config/             # DB connection, environment variables
│   ├── controllers/        # Route handler logic
│   ├── services/           # Business logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── middlewares/        # Auth, error handling
│   ├── utils/              # Helper functions
│   ├── app.js              # App-level config
│   └── server.js           # Entry point
│
├── frontend/               # React frontend (to be added)
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/stackit
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Questions

- `POST /api/questions` - Create a new question
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `PUT /api/questions/:id` - Update a question
- `DELETE /api/questions/:id` - Delete a question
- `PUT /api/questions/:id/vote` - Vote on a question

### Answers

- `POST /api/questions/:questionId/answers` - Create a new answer
- `GET /api/questions/:questionId/answers` - Get all answers for a question
- `PUT /api/answers/:id` - Update an answer
- `DELETE /api/answers/:id` - Delete an answer
- `PUT /api/answers/:id/vote` - Vote on an answer
- `PUT /api/answers/:id/accept` - Accept an answer

### Notifications

- `GET /api/notifications` - Get all notifications for a user
- `PUT /api/notifications/:id` - Mark notification as read
- `PUT /api/notifications` - Mark all notifications as read
- `GET /api/notifications/count` - Get unread notification count

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [React](https://reactjs.org/)
