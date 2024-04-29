const express = require('express');

const {uploadFile,retrieveFile} = require('../controllers/picture');

const router =express.Router({mergeParams:true});

const {protect,authorize} =require('../middleware/auth');

router.route('/').post(protect,authorize('admin','owner'),uploadFile);
router.route('/').get(retrieveFile);

module.exports = router;