const Restaurant = require('../models/Restaurant');

//@desc get all restaurants
//@route GET /api/v1/restautants
//@access Public
exports.getRestaurants = async(req,res,next)=>{
    let query;
    let reqQuery = {...req.query};
    const removeFields = ['remove','sort','page','limit'];
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    let queryStr = JSON.stringify(req.query);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Restaurant.find(JSON.parse(queryStr)).populate('reservations').populate('tables');
    //select
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query=query.sort('-createdAt');
    }
    //page
    const page = parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1)*limit;
    const endIndex = (page*limit);
    const total = await Restaurant.countDocuments();
    query=query.skip(startIndex).limit(limit);
    try{
        const restaurants = await query;
        //page res
        const pagination={};
        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if(startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({
            success:true,
            count:restaurants.length,
            data:restaurants
        });
    }catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc Get single restaurant
//@route GET /api/v1/restaurants/:id
//@acess Public
exports.getRestaurant = async (req,res,next)=>{
    try{
        const restaurant = await Restaurant.findById(req.params.id).populate('menus').populate('tables').populate('reservations').populate('rating');
        if(!restaurant){
            return res.status(400).json({success:false});
        }
        res.status(200).json({
            success:true,
            data:restaurant
        });
    }catch(err){
        res.status(400).json({success:false});
    }
};
//@desc  Add restaurant
//@route POST /api/v1/restaurants
//@acess Private
exports.createRestaurant = async (req,res,next)=>{
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
        success:true,
        data:restaurant});
};
//@desc Update single restaurants
//@route PUT /api/v1/resturants/:id
//@access Private
exports.updateRestaurant= async (req,res,next)=>{
    try{
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidator:true
        });
        if(!restaurant){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:restaurant});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc Delete single restaurants
//@route DELETE /api/v1/restaurants/:id
//@access Private
exports.deleteRestaurant=async(req,res,next)=>{
    try{
        const restaurant = await Restaurant.findById(req.params.id);
        if(!restaurant){
            return res.status(400).json({success:false});
        }
        await restaurant.deleteOne();
        res.status(200).json({success:true,data:{}});
    }catch(err){
        res.status(400).json({success:false});
    }
};





