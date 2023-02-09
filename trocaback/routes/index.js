const express = require('express');
const authRoutes = require('./authRoutes')
const userRoutes = require('./userRoutes')
const ethRoutes = require('./ethRoutes')
const router = express.Router();

module.exports = () => {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Troca' });
  });

  router.use('/auth', authRoutes())
  router.use('/user', userRoutes())
  router.use('/eth', ethRoutes())

  return router
}
