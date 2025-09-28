# Draftly

An AI-powered email management application that helps you automatically generate replies to your Gmail messages using advanced AI technology.

## Features

- **Google OAuth Integration**: Secure authentication with your Google account
- **Gmail Integration**: Fetch and manage your unread emails
- **AI-Powered Replies**: Generate intelligent email responses using AI
- **Reply Regeneration**: Regenerate responses if you're not satisfied with the initial reply
- **Mark as Read**: Automatically mark emails as read after sending replies
- **Real-time Dashboard**: View and manage your emails in a clean interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with modern styling
- **Context API** for state management
- **React Icons** for UI icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Google APIs** (Gmail, OAuth2)
- **Passport.js** for authentication
- **Express Session** for session management
- **CORS** enabled for cross-origin requests

## Project Structure

```
Draftly/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── EmailList/
│   │   │   └── ReplyGenerator/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── config/
│   │   ├── dbConnection.js
│   │   └── googleOauthConnection.js
│   ├── controllers/
│   │   └── aiController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── emailRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   └── gmailService.js
│   ├── app.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Cloud Console project with Gmail API enabled

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Draftly/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/draftly
   SESSION_SECRET=your-session-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   ```

4. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:5000/auth/google/callback`
   - Add authorized JavaScript origins: `http://localhost:3000`

5. **Start the backend server**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables (Optional)**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the frontend server**
   ```bash
   npm start
   ```
   Application will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/user` - Get current user

### Email Management
- `GET /api/emails/unread` - Fetch unread emails
- `POST /api/emails/mark-read/:id` - Mark email as read
- `POST /api/emails/send-reply` - Send reply to email

### AI Features
- `POST /api/ai/generate-reply` - Generate AI reply
- `POST /api/ai/regenerate-reply` - Regenerate AI reply

## Frontend Features

### Components
- **Dashboard**: Main interface showing email statistics and quick actions
- **EmailList**: Display unread emails with preview and actions
- **ReplyGenerator**: AI-powered reply composition interface
- **AuthWrapper**: Handle authentication state and protected routes

### Key Functionality
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Real-time Updates**: Refresh email list and status updates
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Error Handling**: User-friendly error messages and loading states
- **State Management**: Context API for global state management

## Usage

1. **Start Both Servers**: Run backend (port 5000) and frontend (port 3000)
2. **Authentication**: Click "Sign in with Google" to authenticate
3. **View Emails**: Browse your unread Gmail messages in the dashboard
4. **Generate Replies**: Select an email and use AI to generate appropriate responses
5. **Edit & Send**: Review, edit if needed, and send replies
6. **Auto-manage**: Emails are automatically marked as read after sending replies

## Development

### Running in Development Mode
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm start
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## Security Features

- Secure OAuth 2.0 authentication
- Session-based user management
- CORS protection with specific origin
- Environment variable protection for sensitive data
- Protected API routes requiring authentication
- Secure cookie configuration

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is configured for `http://localhost:3000`
2. **OAuth Errors**: Verify Google Cloud Console redirect URIs match exactly
3. **MongoDB Connection**: Ensure MongoDB is running locally or update connection string
4. **Port Conflicts**: Make sure ports 3000 and 5000 are available

### Development Tips
- Use browser dev tools Network tab to debug API calls
- Check browser console for React errors
- Monitor backend console for server errors
- Verify environment variables are loaded correctly

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
