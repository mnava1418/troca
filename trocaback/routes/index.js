const express = require('express');
const authRoutes = require('./authRoutes')
const router = express.Router();

module.exports = () => {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Troca' });
  });

  router.use('/auth', authRoutes())

  return router
}
