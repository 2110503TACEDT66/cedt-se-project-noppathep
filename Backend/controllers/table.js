const Table = require('../models/Table');
const Restaurant  = require('../models/Restaurant');

//@desc get all tables in restaurantId
//@route GET /api/v1/restautants/:restautantId/tables
//@access Public
exports.getTables = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: `Restaurant not found with id ${req.params.restaurantId}` });
        }

        const tables = await Table.find({ restaurant: req.params.restaurantId });

        res.status(200).json({
            success: true,
            count: tables.length,
            data: tables
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

//@desc get Table for this tableID(:id)
//@route GET /api/v1/tables/:id
//@access Private
exports.getTable = async (req,res,next)=>{
    try{
        const table = await Table.findById(req.params.id).populate('restaurant');
        if(!table){
            return res.status(404).json({ success: false, message: `No table with the id of ${req.params.id}` });
        }
        res.status(200).json({
            success:true,
            data:table
        });
    }catch(err){
        console.log(err)
        res.status(400).json({
            success:false,
            message:'Cannot get Table'
        });
    }
};

//@desc add Table for this restaurantID(:id)
//@route POST /api/v1/restaurant/:restaurantId
//@access Praivate
exports.addTable = async (req, res, next) => {
    try {
        const restaurantId = req.params.restaurantId;
        
        const restaurant = await Restaurant.findById(restaurantId);
        console.log(restaurantId)
        if (!restaurant) {
            return res.status(404).json({ success: false, message: `No restaurant with the id of ${restaurantId}` });
        }
        
        req.body.restaurant = restaurantId;
        
        const table = await Table.create(req.body);
        
        res.status(201).json({
            success: true,
            data: table
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot Create Table'
        });
    }
};

//@desc Update Table for this TableId(:id)
//@route POST /api/v1/tables/:id
//@access Private
exports.updateTable= async (req,res,next)=>{
    try{
        const table = await Table.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidator:true
        });
        if(!table){
            return res.status(400).json({
                success:false,
                message : 'Cannot find Table'
            });
        }
        res.status(200).json({success:true,data:table});
    }catch(err){
        res.status(400).json({
            success:false,
            message:'Cannot Update Table'
        });
    }
};

//@desc Delete Table for this TableId(:id)
//@route DELETE /api/v1/tables/:id
//@access Praivate
exports.deleteTable = async(req,res,next)=>{
    try{
        const table = await Table.findById(req.params.id);
        if(!table){
            return res.status(404).json({
                success:false,
                message : 'Cannot find Table'
            });
        }
        await table.deleteOne();
        res.status(200).json({success:true,data:{}});
    }catch(err){
        res.status(400).json({
            success:false,
            message:'Cannot Delete Table'
        });
    }
};