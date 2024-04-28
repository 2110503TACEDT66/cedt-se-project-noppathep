const express = require('express');

const {getMenu,addMenu,updateMenu,deleteMenu} = require('../controllers/menus');

const router =express.Router({mergeParams:true});

const {protect,authorize} =require('../middleware/auth');

router.route('/').post(protect,authorize('admin'),addMenu);
router.route('/:id').get(getMenu).put(protect,authorize('admin'),updateMenu).delete(protect,authorize('admin'),deleteMenu);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: The menu managing API
 * 
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - restaurant
 *       properties:
 *         id:
 *           type: string
 *           description: An auto-generated id of menu
 *           example: 662a1c91a75193da89e68963
 *         name:
 *           type: string
 *           description: Name of a dish
 *           example: fried rice
 *         price:
 *           type: integer
 *           example: 150
 *         restaurant:
 *           type: number
 *           description: id of the restaurant that owns this dish
 *           example: 65fda132323b9f5b9ef7540c
 * 
 * @swagger
 * /menus:
 *   post:
 *     summary: create new menu
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
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
 *                   $ref: '#/components/schemas/Menu'
 *
 * 
 * @swagger
 * /menus/{id}:
 *   get:
 *     summary: Get menu by id
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu id
 *         example: 662a1c91a75193da89e68963
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
 *                   $ref: '#/components/schemas/Menu'
 *
 *   put:
 *     summary: update a table for a restaurant by id
 *     tags: [Menu]
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
 *             $ref: '#/components/schemas/Menu'
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
 *                   $ref: '#/components/schemas/Menu'
 *
 *   delete:
 *     summary: remove the table by id
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu id
 *         example: 662a1c91a75193da89e68963
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
