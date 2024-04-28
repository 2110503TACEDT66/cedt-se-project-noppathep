const express = require('express');

const {getReservations,getReservation,addReservation,updateReservation,deleteReservation,orderFood,removeFood,addTable,removeTable,paidReservation} = require('../controllers/reservation');
const { addRating, getRatingByReservation, deleteRating } = require('../controllers/rating');
const router = express.Router({mergeParams:true});
const {protect,authorize} =require('../middleware/auth');

router.route('/:reservationId/rating/').get(getRatingByReservation).put(protect, authorize('user', 'admin'), addRating).delete(protect, authorize('user', 'admin'), deleteRating);
router.route('/').get(protect,getReservations).post(protect,authorize('admin','user'),addReservation);
router.route('/:id').get(protect,getReservation).put(protect,authorize('admin','user','owner'),updateReservation).delete(protect,authorize('admin','user','owner'),deleteReservation);
router.route('/:id').post(protect,authorize('admin','user'),orderFood);
router.route('/:id/:food').delete(protect,authorize('admin','user'),removeFood);
router.route('/:id/tables').post(protect,authorize('admin','user'),addTable);
router.route('/:id/tables/:tableid').delete(protect,authorize('admin','user'),removeTable);
router.route('/:id/paid').put(protect,authorize('admin','user'),paidReservation);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reservation
 *   description: The reservation managing API
 * 
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - restaurant
 *         - apptDate
 *       properties:
 *         id:
 *           type: string
 *           description: An auto-generated id of reservation
 *           example: 662a1b52f0e4f72c64379f83
 *         user:
 *           type: string
 *           description: An id of user
 *           example: 65e597ccf0df2dd00a93c179
 *         restaurant:
 *           $ref: '#/components/schemas/Restaurant'
 *           description: restaurant schema
 *         apptDate:
 *           type: string
 *           format: date-time
 *           description: reserve date
 *           example: 2024-04-29T13:05:00.000+00:00
 *         foodOrder:
 *           type: array
 *           description: An array of an food item
 *           example: [65e597ccf0df2dd00a93c179,65e597ccf0df2dd00a93c180,65e597ccf0df2dd00a93c1781]
 *           items:
 *             type: string
 *         reserveTable:
 *           type: array
 *           description: An array of table
 *           example: [662a1ca9a75193da89e6896b,662a1ca9a75193da89e6896c,662a1ca9a75193da89e6896d]
 *           items:
 *             type: string
 *         paid:
 *           type: boolean
 *           description: to check wheather user is pay
 *           example: false
 *         rating:
 *           $ref: '#/components/schemas/Rating'
 *           example:
 *             id: 662a1c45a75193da89e6890a
 *             user: 65e597ccf0df2dd00a93c179
 *             reservation: 662a1b52f0e4f72c64379f83
 *             restaurant: 65fda132323b9f5b9ef7540c
 *             rating: 4
 *             comment: "This restaurant is very good."
 * 
 * 
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservation]
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *
 * @swagger
 * /reservations/{id}/tables/{tableid}:
 *   delete:
 *     summary: Add new table
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *         example: 65fda132323b9f5b9ef7540c
 *       - in: path
 *         name: tableid
 *         schema:
 *           type: string
 *         required: true
 *         description: The table id
 *         example: 662a1ca9a75193da89e6896f
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
 *                   $ref: '#/components/schemas/Reservation'
 * /reservations/{id}/tables:
 *   post:
 *     summary: Add new table
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 * 
 * @swagger
 * /reservations/{id}/paid:
 *   put:
 *     summary: making payment for the reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *         example: 662a1b52f0e4f72c64379f83
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   allOf:
 *                     - $ref: '#/components/schemas/Reservation'
 *                     - populated:
 *                       type: object
 *                       properties:
 *                         paid:
 *                           type: boolean
 *                           example: true 
 *                 points:
 *                   type: number
 *                   example: 180
 *                 message : 
 *                   type: string
 *                   example: You have gained 180 points
 * 
 * @swagger
 * /reservations/{reservationId}/:
 *   post:
 *     summary: Get rating information of the reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *         example: 662a1b52f0e4f72c64379f83
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: 662a1c91a75193da89e68963
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   allOf:
 *                     - $ref: '#/components/schemas/Reservation'
 *                     - populated:
 *                       type: object
 *                       properties:
 *                         foodOrder:
 *                           type: array
 *                           items: 
 *                             type: string 
 *                           example: 
 *                             - 662a1c91a75193da89e68963
 * 
 * 
 * @swagger
 * /reservations/{id}/{food}:
 *   delete:
 *     summary: remove food from the reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *         example: 662a1b52f0e4f72c64379f83
 *       - in: path
 *         name: food
 *         schema:
 *           type: string
 *         required: true
 *         description: The food id
 *         example: 662a1ca5a75193da89e68967
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 * 
 * @swagger
 * /reservations/{id}/rating:
 *   get:
 *     summary: Get rating info of reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *         example: 662a1c36a75193da89e688ec
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Rating'
 * 
 *   put:
 *     summary: Add rating to reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *         example: 662a1c36a75193da89e688ec
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: This restaurant is very good
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Rating'
 * 
 *   delete:
 *     summary: Add rating to reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *         example: 662a1c36a75193da89e688ec
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: This restaurant is very good
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 * 
 */