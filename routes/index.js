const express = require('express');
const router = express.Router();
const joi = require('joi');
const bcrypt = require('bcryptjs');

const schema = joi.object({
  name : joi.string().min(3).max(20).required(),
  email : joi.string().email().required(),
  password : joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confrimPassword : joi.ref('password')
})

const users = []

router.get('/', function(req, res, next) {
  res.render('index', { users });
});


router.get('/login', function(req, res, next) {
  res.render('login')
});

router.post('/',async function(req, res, next) {
  try {
    const body = await schema.validateAsync(req.body)
    body.id = crypto.randomUUID()
    /////////////
    ////////////
    ///////////

    const hashPassword = bcrypt.hashSync(body.password, 10)
    body.password = hashPassword
    delete body.confrimPassword
    users.push(body)
    res.redirect('/login')
    // res.render('index', {users})
  } catch (error) {
    res.json(error)
  }
});


router.post('/login', function(req, res, next) {
  const {email, password} = req.body 
  
  const user = users.find((user) => user.email === email)
  if(user) {
       /////////////
    ////////////
    ///////////
    const validatePassword = bcrypt.compareSync(password, user.password)
    if( validatePassword) {
      res.send(true)
    }
  }else {
    res.send('err')
  }
  // res.render('login')
});

module.exports = router;
