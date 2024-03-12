var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('USERS');
});

router.get('/profiles', (req, res, next) => { 
  res.render('layout', {title: 'PROFILES', description: 'Browse user profiles'});
});

module.exports = router;
