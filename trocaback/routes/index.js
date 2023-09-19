const express = require('express');
const authRoutes = require('./authRoutes')
const userRoutes = require('./userRoutes')
const portfolioRoutes = require('./portfolioRoutes')
const exchangeRoutes = require('./exchangeRoutes')
const notificationRoutes = require('./notificationRoutes')
const auctionRoutes = require('./auctionRoutes')
const router = express.Router();

module.exports = () => {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Troca' });
  });

  router.use('/auth', authRoutes())
  router.use('/user', userRoutes())
  router.use('/portfolio', portfolioRoutes())
  router.use('/exchange', exchangeRoutes())
  router.use('/notifications', notificationRoutes())
  router.use('/auction', auctionRoutes())

  return router
}
