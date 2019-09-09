const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');

const AuthRouter = require('./auth/auth-router.js');
const UserRouter = require('./users/user-router.js');
const db = require('./data/dbConfig.js'); // look at

const server = express();

const knexSessionStore = connectSessionKnex(session);

const sessionConfig = {
    name: 'user session',
    secret: 'a face only a mother could love',
    cookie: {
        maxAge: 1000 * 60 * 60, // The session is set to expire after 1 hour in milliseconds.
        secure: false, // if true, it'llb only set cookies over https. The server will not send back a cookie over http.
        httpOnly: true // When set to true, the browser cant access access cookies via JS.
    },
    resave: false,
    saveUnintialized: false,
    store: new knexSessionStore({
        knex: db,
        tablename: 'session',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', AuthRouter)
server.use('/api/users', UserRouter);

module.exports = server;