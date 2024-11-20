const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'strict', 
    maxAge: 1000 * 60 * 60 * 24 // 1 day
    // maxAge: 1000 * 30, // 30 second for testing 
  }
});

// Sync the session store to create the sessions table
// sessionStore.sync();

module.exports = sessionMiddleware;
