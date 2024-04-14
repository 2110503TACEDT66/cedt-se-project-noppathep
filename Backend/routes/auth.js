const express = require('express');
const {register,login,getMe, updateProfile,logout} = require('../controllers/auth');

const router =express.Router();
const {protect} =require('../middleware/auth');

router.post('/register',register);
router.post('/login',login);
router.put('/update',protect,updateProfile);
router.get('/me',protect,getMe);
router.get('/logout',logout);

module.exports=router;