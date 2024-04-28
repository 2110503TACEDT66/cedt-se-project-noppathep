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

/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - telephone
 *         - email
 *         - role
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: An auto-generated id of user
 *           example: 65e2d2136dabb9b332425377
 *         name:
 *           type: string
 *           example: Jin-woo Sung
 *         telephone:
 *           type: string
 *           example: 0123456789
 *         email:
 *           type: string
 *           example: testEmail@gmail.com
 *         role:
 *           type: string
 *           description: use to authorize user
 *           example: admin
 *         password:
 *           type: string
 *           description: password stored in hash
 *           example: $2a$10$YDL312sffsRaw9BxEe43zs0yTRkRaya03VmswhhrY4GUw6VkdhY8G
 *         point:
 *           type: integer
 *           description: point use to exchange a discount
 *           example: 380
 *         card:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Card'
 * 
 *     Card:
 *       type: object
 *       required:
 *         - id
 *         - cardNumber
 *         - cardHolder
 *         - cardMonth
 *         - cardYear
 *         - cardCvv
 *       properties:
 *         id:
 *           type: string
 *           example: 3522580d-f127-449c-ae7a-3162a753ed9a
 *         cardNumber:
 *           type: string
 *           example: 3434343434343434
 *         cardHolder:
 *           type: string
 *           example: Santa Clause
 *         cardMonth:
 *           type: string
 *           example: 06
 *         cardYear:
 *           type: string
 *           example: 2026
 *         cardCvv:
 *           type: string
 *           example: 6666
 * 
 */