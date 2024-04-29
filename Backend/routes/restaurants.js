


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
router.route('/').get(getRestaurants).post(protect,authorize('admin', 'owner'),createRestaurant);
router.route('/:id').get(getRestaurant).put(protect,authorize('admin', 'owner'),updateRestaurant).delete(protect,authorize('admin', 'owner'),deleteRestaurant);


module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Restaurant
 *   description: The restaurant managing API
 * 
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *         - address
 *         - tel
 *         - openingHours
 *       properties:
 *         id:
 *           type: string
 *           description: An auto-generated id of reservation
 *           example: 65fda132323b9f5b9ef7540c
 *         name:
 *           type: string
 *           description: An id of user
 *           example: Whalebone Steakhouse and Grill
 *         address:
 *           type: object
 *           properties:
 *             district:
 *               type: string
 *               example: Banglamphu Riverside
 *             province:
 *               type: string
 *               example: Bangkok
 *             postalcode:
 *               type: string
 *               example: 10200
 *             region:
 *               example: Central Thailand
 *           description: An address of the restaurant
 *         tel:
 *           type: string
 *           description: restaurant's telephone number
 *           example: 0123456789
 *         openingHours:
 *           type: object
 *           properties:
 *             open:
 *               type: string
 *               example: 17:00
 *             close:
 *               type: string
 *               example: 23:00
 *         img:
 *           type: string
 *           description: path to the restaurant image
 *           example: /img/whalebone.jpg
 *         owner:
 *           type: string
 *           description: user id of the restaurant owner
 *           example: 662745ebbba967251438d516
 *         averageRating:
 *           type: number
 *           description: Rating of the restaurant
 *           example: 3.5
 * 
 *     Rating:
 *       type: object
 *       required:
 *         - rating
 *         - user
 *         - restaurant
 *         - reservation
 *         - comment
 *       properties:
 *         id:
 *           type: string
 *           description: An auto-generated id of rating
 *           example: 662a1c45a75193da89e6890a
 *         user:
 *           type: string
 *           description: An id of user
 *           example: 65e41c912d8fc2f35d8e802e
 *         rating:
 *           type: number
 *           example: 4
 *         restaurant:
 *           type: string
 *           description: An id of restaurant
 *           example: 012365fda132323b9f5b9ef7540c456789
 *         reservation:
 *           type: string
 *           description: An id of reservation
 *           example: 662a1c36a75193da89e688ec
 *         comment:
 *           type: string
 *           description: comment from user to restaurant
 *           example: "This restaurant is very good."
 * 
 * 
 * @swagger
 * /restaurants/{restaurantId}/rating:
 *   get:
 *     summary: get restaurant's average rating and all rating datas
 *     security:
 *       - bearerAuth: []
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *         example: 65fda132323b9f5b9ef7540c
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - count
 *                 - averageRating
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 averageRating:
 *                   type: number
 *                   example: 4
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rating'
 *
 */
