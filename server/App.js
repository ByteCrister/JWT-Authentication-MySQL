
require('dotenv').config();

const express = require('express');
const cors = require('cors');

var jwt = require('jsonwebtoken');
const passport = require('passport');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('./config/DB');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

require('./config/passport');


// * Home route
app.get('/', (req, res) => {
    res.send(`<h1>This is home route.</h1>`)
});


// * User Register route
app.post('/user/register', async (req, res) => {
    const { userName, password } = req.body;

    try {
        const userExists = await new Promise((resolve, reject) => {
            db.query('SELECT user_name FROM users WHERE user_name = ?', [userName], (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) return resolve(true);
                resolve(false);
            });
        });

        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await new Promise((resolve, reject) => {
            db.query('INSERT INTO users (user_name, password, created_on) VALUES (?, ?, CURDATE())',
                [userName, hashedPassword],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
        });


        res.status(201).json({ message: `User registered successfully. User : ${newUser}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
});
// ----------------------------------------------------------------------------------------


// * User log-In route
app.post('/user/log-in', async (req, res) => {
    const { userName, password } = req.body;

    try {
        const User = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE user_name = ?', [userName], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (!User || User.length === 0) {
            return res.status(401).json({ message: 'User not found!' });
        }

        const passwordMatch = bcrypt.compareSync(password, User[0].password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect Password!' });
        }

        const payload = {
            user_no: User[0].user_no,
            username: User[0].user_name
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2d' });

        return res.status(200).send({
            success: true,
            message: 'Logged In Successfully.',
            token: 'Bearer ' + token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});


// * User profile route( protected )
app.get('/user/profile', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.status(200).json({
            success: true,
            id: req.user.user_no,
            userName: req.user.user_name
        });
    });




// * Resource not found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found!!' });
    next();
});


// * Server error
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: 'Server broken!!' })
    next();
});

module.exports = app;