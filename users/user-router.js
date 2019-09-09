const express = require('express');

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');
const router = express.Router();


//Get Restricted users
router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

module.exports = router;