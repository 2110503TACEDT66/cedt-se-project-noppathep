const express = require('express');

const {getReservations,getReservation,addReservation,updateReservation,deleteReservation,orderFood,removeFood,addTable,removeTable} = require('../controllers/reservation');
const { addRating, getRatingByReservation, deleteRating } = require('../controllers/rating');
const router = express.Router({mergeParams:true});
const {protect,authorize} =require('../middleware/auth');

router.route('/:reservationId/rating/').get(getRatingByReservation).put(protect, authorize('user', 'admin'), addRating).delete(protect, authorize('user', 'admin'), deleteRating);
router.route('/').get(protect,getReservations).post(protect,authorize('admin','user'),addReservation);
router.route('/:id').get(protect,getReservation).put(protect,authorize('admin','user'),updateReservation).delete(protect,authorize('admin','user'),deleteReservation);
router.route('/:id').post(protect,authorize('admin','user'),orderFood);
router.route('/:id/:food').delete(protect,authorize('admin','user'),removeFood);
router.route('/:id/tables').post(protect,authorize('admin','user'),addTable);
router.route('/:id/tables/:tableid').delete(protect,authorize('admin','user'),removeTable);

module.exports = router;