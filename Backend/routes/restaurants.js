const express = require('express');

const {protect,authorize} = require('../middleware/auth');
const{getRestaurant,getRestaurants,updateRestaurant,createRestaurant,deleteRestaurant} = require('../controllers/restaurants');

const reservationRouter = require('./reservations');
const tableRouter = require('./tables');
const { getRatingByRestaurant } = require('../controllers/rating');

const router = express.Router({mergeParams:true});

router.use('/:restaurantId/reservations/', reservationRouter);
router.use('/:restaurantId/tables/', tableRouter);
router.route('/:restaurantId/rating/').get(getRatingByRestaurant);
router.route('/').get(getRestaurants).post(protect,authorize('admin'),createRestaurant);
router.route('/:id').get(getRestaurant).put(protect,authorize('admin'),updateRestaurant).delete(protect,authorize('admin'),deleteRestaurant);

module.exports = router;