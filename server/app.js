const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const AuthRoutes = require('./src/routes/auth')
const FieldRoutes = require('./src/routes/field')
const sessionMiddleware = require('./utilis/session');
const { Connection } = require('./src/models');
const app = express()
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('zolexomart application server is running on this PORT')
});

app.use('/auth', AuthRoutes);
app.use('/field-meeting', FieldRoutes);


// Start the server
Connection().then(() => {
    try {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (err) {
        next(err);
    }
});
