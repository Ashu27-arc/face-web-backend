# Face Recognition Backend

Backend server for Face Recognition Web Application with user authentication and face data management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/face-recognition
JWT_SECRET=your_jwt_secret_key_here
```

3. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
face-web-backend/
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── models/
│   └── User.js          # User model with face descriptors
├── routes/
│   └── auth.js          # Authentication routes
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Dependencies
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "faceDescriptor": [array of 128 numbers]
}
```

#### Login with Password
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Login with Face
```http
POST /api/auth/face-login
Content-Type: application/json

{
  "faceDescriptor": [array of 128 numbers]
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed),
  faceDescriptor: [Number] (128 dimensions),
  createdAt: Date
}
```

## 🛠️ Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/face-recognition |
| JWT_SECRET | Secret key for JWT | (required) |

## 🚀 Deployment

### Deploy to Heroku

1. Create a Heroku app:
```bash
heroku create your-app-name
```

2. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key
```

3. Deploy:
```bash
git push heroku main
```

### Deploy to Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

### Deploy to Render

1. Create a new Web Service
2. Connect your repository
3. Add environment variables
4. Deploy

## 🔧 Development

### Run in development mode with nodemon:
```bash
npm install -g nodemon
nodemon server.js
```

## 📊 Face Recognition Logic

The backend uses Euclidean distance to match face descriptors:
- Threshold: 0.6
- Lower distance = better match
- Face descriptors are 128-dimensional arrays

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify network access in MongoDB Atlas

### CORS Errors
- Check frontend URL in CORS configuration
- Update allowed origins in `server.js`

### JWT Errors
- Verify JWT_SECRET is set in environment variables
- Check token expiration (default: 7 days)

## 📄 License

MIT License
# face-web-backend
