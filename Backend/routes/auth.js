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
 * tags:
 *   name: User
 *   description: The user managing API
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: TestUser@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - token
 *                 - name
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M3c2c21421cZGQ2c42v5215YzY3ZThlZTczMjcwODUwZSIsImlhdCI6MTcxNDM3NTA1MCwiZXhwIjoxNz4234cih2yuPyfft6d6qafKAU--yY4KOd8rOSpQ3lxkArf5aFNNM0Y
 *                 name:
 *                   type: string
 *                   example: TestUser
 *
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout
 *     tags: [User]
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Logout
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *
 */