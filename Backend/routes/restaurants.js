const express = require('express');

const {protect,authorize} = require('../middleware/auth');

const{getRestaurant,getRestaurants,updateRestaurant,createRestaurant,deleteRestaurant} = require('../controllers/restaurants');
const{getTables} = require('../controllers/table');

const reservationRouter = require('./reservations');
const ratingRouter = require('./rating');

const router =express.Router();

router.use('/:restaurantId/reservations/', reservationRouter);
router.use('/:restaurantId/rating/', ratingRouter);

router.route('/').get(getRestaurants).post(protect,authorize('admin'),createRestaurant);
router.route('/:id').get(getRestaurant).put(protect,authorize('admin'),updateRestaurant).delete(protect,authorize('admin'),deleteRestaurant);
router.route('/:restaurantId/tables').get(getTables);


module.exports = router;