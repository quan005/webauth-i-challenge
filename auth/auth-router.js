//Register New user
const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

const router = express.Router();

router.post('/register', (req, res) => {
    let user = req.body;
    console.log('password arriving from client', user.password);
  
    //salt 
    user.password = bcrypt.hashSync(user.password, 14);
    console.log('password heading to db', user.password);
  
    Users.add(user)
      .then(saved => {
            req.session.user = saved;
            res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
});


//Login user
router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          console.log('db password', user.password);
          console.log('login password', password);
          req.session.user = user;
          res.status(200).json({ message: `Welcome ${user.username}, here's a cookie!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});


// Logout user
router.get('/logout', (req, res) => {
    if(req.session) {
      req.session.destroy(err => {
        if(err) {
          res.json({
            message: "You can checkout but you can't leave"
          });
        } else {
          res.json({message: "You have successfully logged out"}).end();
        }
      })
    }
});

module.exports = router;