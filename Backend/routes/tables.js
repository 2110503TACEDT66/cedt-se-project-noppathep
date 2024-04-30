const express = require('express');

const {addTable, deleteTable, updateTable, getTable, getTables} = require('../controllers/table');

const router = express.Router({mergeParams : true});

const {protect,authorize} =require('../middleware/auth');

router.route('/').get(protect,authorize('user','owner','admin'),getTables).post(protect,authorize('admin'),addTable);
router.route('/:id').get(protect,authorize('admin'),getTable).put(protect,authorize('admin'),updateTable).delete(protect,authorize('admin'),deleteTable);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Table
 *   description: The table managing API
 * 
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       required:
 *         - size
 *         - restaurant
 *       properties:
 *         id:
 *           type: string
 *           description: An auto-generated id of table
 *           example: 6619215854fac1afb69f3a6d
 *         size:
 *           type: integet
 *           description: number of seats
 *           example: 4
 *         restaurant:
 *           type: string
 *           description: id of the retaurant that a table belongs to
 *           example: 65fda132323b9f5b9ef7540c
 * 
 * @swagger
 * /restaurants/{restaurantId}/tables:
 *   get:
 *     summary: Get all tables belong to a restaurant
 *     security:
 *       - bearerAuth: []
 *     tags: [Table]
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
 *                 - data
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
 *                     $ref: '#/components/schemas/Table'
 *
 *   post:
 *     summary: create new table for a restaurant
 *     security:
 *       - bearerAuth: []
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *         example: 65fda132323b9f5b9ef7540c
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       201:
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
 *                   $ref: '#/components/schemas/Table'
 * 
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Get table by its id
 *     security:
 *       - bearerAuth: []
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The table id
 *         example: 6619215854fac1afb69f3a6d
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
 *                   $ref: '#/components/schemas/Table'
 *
 *   put:
 *     summary: update a table for a restaurant by id
 *     security:
 *       - bearerAuth: []
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The table id
 *         example: 6619215854fac1afb69f3a6d
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
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
 *                   $ref: '#/components/schemas/Table'
 *
 *   delete:
 *     summary: remove the table by id
 *     security:
 *       - bearerAuth: []
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The table id
 *         example: 6619215854fac1afb69f3a6d
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
 *
 */