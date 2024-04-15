const express = require('express');

const {addTable, deleteTable, updateTable, getTable, getTables} = require('../controllers/table');

const router = express.Router({mergeParams : true});

const {protect,authorize} =require('../middleware/auth');

router.route('/').get(protect,authorize('user','admin'),getTables).post(protect,authorize('admin'),addTable);
router.route('/:id').get(protect,authorize('admin'),getTable).put(protect,authorize('admin'),updateTable).delete(protect,authorize('admin'),deleteTable);

module.exports = router;