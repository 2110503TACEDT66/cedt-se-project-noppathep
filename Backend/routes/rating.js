const express = require('express');
const router = express.Router({mergeParams : true}); 

const { addRating, getRating, updateRating, deleteRating } = require('../controllers/rating');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getRating).post(protect, authorize('user', 'admin'), addRating).put(protect, authorize('user', 'admin'), updateRating).delete(protect, authorize('user', 'admin'), deleteRating);

module.exports = router;