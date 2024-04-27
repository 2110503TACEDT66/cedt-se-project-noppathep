const Reservation = require('../models/Reservation');
const Restaurant  = require('../models/Restaurant');
const Menu  = require('../models/Menu');
const Table = require('../models/Table');
const User = require('../models/User');

//@desc Get all reservation
//@route GET /api/v1/reservations
//@access Public
exports.getReservations=async (req,res,next)=>{
    let query;
    if(req.user.role !== 'admin'){
        query = Reservation.find({user:req.user.id}).populate({
            path:'restaurant',
            select:'name province tel image openingHours'
        }).populate("rating");}
    else{
        query = Reservation.find().populate({
            path:"restaurant",
            select:'name tel image openingHours'
        }).populate("rating");}
    try{
        const reservations = await query;
        res.status(200).json({
            success: true,
            count:reservations.length,
            data:reservations
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot find Reservation'
        });
    }
};
//@desc Get single reservation
//@route GET /api/v1/reservations/:id
//@acess Public
exports.getReservation=async (req,res,next)=>{
    try{
        const reservation = await Reservation.findById(req.params.id)
        .populate({
            path:'restaurant',
            select:'name province tel image openingHours'
        })
        .populate({
            path: 'foodOrder', 
            model: 'Menu',
            select: 'name price'
        });
        
        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.parms.id}`});
        }
        let totalPrice = 0;
        reservation.foodOrder.forEach(menuItem => {
          totalPrice += menuItem.price;
        });
        res.status(200).json({
          success: true,
          data: reservation,
          totalPrice: totalPrice
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot find Reservation'
        });
    }
};
//@desc  Add reservation
//@route POST /api/v1/restaurants/:restaurantId/reservation
//@acess Private
exports.addReservation=async (req,res,next)=>{
    try{
        req.body.restaurant = req.params.restaurantId;
        req.body.id = req.user.id;
        const existedReservation = await Reservation.find({user:req.user.id});
        if(existedReservation.length>=3&&req.user.role!=='admin'){
            return res.status(400).json({
                success:false,
                message:`The user with the id ${req.user.id} has already made 3 reservation`
            });
        }

        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if(!restaurant){
            return res.status(404).json({success:false,message:`No restaurant with the id of ${req.parms.restaurantId}`});
        }
        const { apptDate } = req.body;
        const { open , close } =  restaurant.openingHours;
        const today = new Date();
        const thailandTime = new Date(today.getTime() + (7 * 60 * 60 * 1000));
        const reservationTime = new Date(apptDate);
        if(reservationTime < thailandTime) {
            return res.status(400).json({
                success : false,
                message : "Reservation must be scheduled for a time after today"
            })
        }

        const openTime = new Date(reservationTime.getFullYear(), reservationTime.getMonth(), reservationTime.getDate(), parseInt(open.split(':')[0]), parseInt(open.split(':')[1]));
        const closeTime = new Date(reservationTime.getFullYear(), reservationTime.getMonth(), reservationTime.getDate(), parseInt(close.split(':')[0]), parseInt(close.split(':')[1]));
        
        console.log(reservationTime.getDate().toString())

        if(reservationTime.getDate().toString() != reservationTime.toUTCString().substring(5,7)) {
            closeTime.setTime(closeTime.getTime() - (24 * 60 * 60 * 1000));
            openTime.setTime(openTime.getTime() - (24 * 60 * 60 * 1000));
        }
        closeTime.setTime(closeTime.getTime() + (7 * 60 * 60 * 1000));
        openTime.setTime(openTime.getTime() + (7 * 60 * 60 * 1000));

        if(closeTime < openTime) {
            closeTime.setTime(closeTime.getTime() + (24 * 60 * 60 * 1000));
        }

        if(reservationTime > closeTime || reservationTime < openTime) {
            return res.status(400).json({
                    success: false,
                    message: 'Reservation must be within restaurant opening hours'
            });
        }

        const oneHourBeforeClose = new Date(closeTime.getTime() - (1 * 60 * 60 * 1000));
        if(reservationTime > oneHourBeforeClose) {
            return res.status(400).json({
                    success: false,
                    message: 'Reservation must be before restaurant close time 1 hour'
            });
        }
        console.log(req.body);

        req.body.apptDate = new Date(reservationTime.getTime() - (7*60*60*1000))
        const reservation = (await Reservation.create(req.body));
        res.status(201).json({
            success: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Create Reservation'
        });
    }
};

//@desc  Update reservation
//@route PUT /api/v1/reservations/:id
//@acess Private
exports.updateReservation=async (req,res,next)=>{
    try{   
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }
        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorize to update this bootcamp`
            });
        }

        const { apptDate } = req.body;
        if(apptDate) {
            const restaurant = await Restaurant.findById(reservation.restaurant);
            const { open, close } = restaurant.openingHours;
            const today = new Date();
            const reservationTime = new Date (new Date(apptDate).getTime() + (7 * 60 * 60 * 1000));
            const openTime = new Date(reservationTime.getFullYear(), reservationTime.getMonth(), reservationTime.getDate(), parseInt(open.split(':')[0]), parseInt(open.split(':')[1]));
            const closeTime = new Date(reservationTime.getFullYear(), reservationTime.getMonth(), reservationTime.getDate(), parseInt(close.split(':')[0]), parseInt(close.split(':')[1]));
            
            if(reservationTime.getDate().toString() != reservationTime.toUTCString().substring(5,7)) {
                closeTime.setTime(closeTime.getTime() - (24 * 60 * 60 * 1000));
                openTime.setTime(openTime.getTime() - (24 * 60 * 60 * 1000));
            }
            closeTime.setTime(closeTime.getTime() + (7 * 60 * 60 * 1000));
            openTime.setTime(openTime.getTime() + (7 * 60 * 60 * 1000));

            if(closeTime < openTime) {
                closeTime.setDay(closeTime.setTime(closeTime.getTime() + (24 * 60 * 60 * 1000)));
            }
            console.log(reservationTime)
            console.log(openTime)
            console.log(closeTime)

            if(reservationTime > closeTime || reservationTime < openTime) {
                return res.status(400).json({
                    success: false,
                    message: 'Reservation must be within restaurant opening hours'
                });
            }

            const oneHourBeforeClose = new Date(closeTime.getTime() - (1 * 60 * 60 * 1000));
            if(reservationTime > oneHourBeforeClose) {
                return res.status(400).json({
                    success: false,
                    message: 'Reservation must be befor restaurant close time 1 hour'
               });
            } 
        }
        
        reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot update Reservation'
        });
    }
};
//@desc  Delete reservation
//@route DELETE /api/v1/reservations/:id
//@acess Private
exports.deleteReservation=async (req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }
        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorize to delete this bootcamp`
            });
        }
    await reservation.deleteOne();
        res.status(200).json({
            success: true,
            data:{}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot delete Reservation'
        });
    }
};
//@desc OrderFood body = { id: menuid}
//@route POST /api/v1/reservations/:id
//Private
exports.orderFood =async (req,res,next)=>{
    try{
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(400).json({
                success:false,
                message:`Cannot find reservation with id of ${req.params.id}`
            });
        }
        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorize to delete this bootcamp`
            });
        }

        const item = await Menu.findById(req.body.id);
        if(!item){
            return res.status(404).json({success:false,message:`There are no such item on menu`});
        }
        if(!item.restaurant.equals(reservation.restaurant)){
            return res.status(404).json({success:false,message:`Your reserved restaurant does not have the current item`});
        }
        reservation.addItem(item);
        res.status(200).json({
            success: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Order Food'
        });
    }
};
//@desc Cancel Food 
//@route POST /api/v1/reservations/:id/:food
//Private
exports.removeFood=async (req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }
        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorize to delete this bootcamp`
            });
        }
        reservation.removeItem(req.params.food);
        res.status(200).json({
            success: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot delete Food order'
        });
    }
};
//@desc add Table
//@route  POST /api/v1/reservations/:id/tables
//Private
exports.addTable = async(req,res,next) => {
    try{
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(400).json({
                success:false,
                message:`Cannot find reservation with id of ${req.params.id}`
            });
        }
        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorize to reserve this table`
            });
        }
        
        const table = await Table.findById(req.body.id);
        if(!table){
            return res.status(404).json({success:false,message:`There are no such table in this restautarant`});
        }
        if(!table.restaurant.equals(reservation.restaurant)){
            return res.status(404).json({success:false,message:`Your reserved restaurant does not have the current table`});
        }
        if(reservation.reserveTable.includes(table._id)) {
            return res.status(400).json({
                success: false,
                message: `The table with id ${table._id} is already reserved`
            });
        }
    
        reservation.addTable(table);
        res.status(200).json({
            success: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot reserve table'
        });
    }
};
//@desc remove Table 
//@route DELETE /api/v1/reservations/:id/tables/:tableid
//Private
exports.removeTable=async (req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }
        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorize to delete this reserve table`
            });
        }
        if(!reservation.reserveTable.includes(req.params.tableid)) {
            return res.status(400).json({
                success: false,
                message: `The table with id ${req.params.tableid} is not in this reservation`
            });
        }
        reservation.removeTable(req.params.tableid);
        res.status(200).json({
            success: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot delete table reserve'
        });
    }
};

//@desc paid 
//@route UPDATE /api/v1/reservations/:id/paid
//Private
exports.paidReservation=async (req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id).populate({
            path:'user',
            select:'points'
        }).populate({
            path: 'foodOrder', 
            model: 'Menu',
            select: 'name price'
          });

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        let totalPrice = 0;
        reservation.foodOrder.forEach(menuItem => {
          totalPrice += menuItem.price;
        });

        if(reservation.user._id.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorize to delete this reservation`
            });
        }
        if(reservation.paid){
            return res.status(401).json({
                success:false,
                message:`This reservstion is already paid`,
                data:reservation});
        }
        await Reservation.findByIdAndUpdate(req.params.id,
            {
                paid:true
            });
        //console.log(totalPrice);
        const gainpoint = Math.floor(0.1*(totalPrice)) + reservation.user.points;
        //console.log(gainpoint);
        //console.log(reservation.user._id)
        await User.findByIdAndUpdate(reservation.user._id,
            {
                points:gainpoint
            })
        reservation = await Reservation.findById(req.params.id).populate("user");

        res.status(200).json({
            success: true,
            data:reservation,
            message :`You have gained ${gainpoint} points`
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot make a payment, Please try again'
        });
    }
};