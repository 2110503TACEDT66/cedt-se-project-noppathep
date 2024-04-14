const express = require('express');

const {addTable, deleteTable, updateTable, getTable} = require('../controllers/table');

const router =express.Router();

const {protect,authorize} =require('../middleware/auth');

router.route('/:id').post(protect,authorize('admin'),addTable).get(protect,authorize('admin'),getTable).put(protect,authorize('admin'),updateTable).delete(protect,authorize('admin'),deleteTable);


module.exports = router;