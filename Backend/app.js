require("dotenv").config()
const express = require('express');
const session = require('express-session');
const cors = require('cors'); 
const connectDB = require('./config/dbConnection');
const passport = require('./config/googleOauthConnection');

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoutes")
const emailRoutes = require('./routes/emailRoutes')
const aiRoutes = require('./routes/aiRoutes')

app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true  
}));

connectDB();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/emails', emailRoutes); 
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Draftly API is running!',
    status: 'success',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Draftly server running on port ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}`);
});

module.exports = app;