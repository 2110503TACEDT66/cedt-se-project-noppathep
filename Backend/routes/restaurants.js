const express = require('express');

const {protect,authorize} = require('../middleware/auth');
const{getRestaurant,getRestaurants,updateRestaurant,createRestaurant,deleteRestaurant} = require('../controllers/restaurants');

const reservationRouter = require('./reservations');
const ratingRouter = require('./rating');
const tableRouter = require('./tables');

const router = express.Router({mergeParams:true});

router.use('/:restaurantId/reservations/', reservationRouter);
router.use('/:restaurantId/rating/', ratingRouter);
router.use('/:restaurantId/tables/', tableRouter);

router.route('/').get(getRestaurants).post(protect,authorize('admin', 'owner'),createRestaurant);
router.route('/:id').get(getRestaurant).put(protect,authorize('admin', 'owner'),updateRestaurant).delete(protect,authorize('admin', 'owner'),deleteRestaurant);


module.exports = router;
