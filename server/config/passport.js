require('dotenv').config();
const db = require('./DB');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    db.query('SELECT * FROM users WHERE user_no = ?', [jwt_payload.user_no], (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user && user.length > 0) {
            return done(null, user[0]);
        } else {
            return done(null, false);
        }
    });
}));