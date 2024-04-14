const Reservation = require('../models/Reservation');
const Restaurant  = require('../models/Restaurant');
const Rating = require('../models/Rating');

//@desc get Rating  in restaurant
//@route GET /api/v1/restaurants/:restaurantId/rating
//Private
exports.getRating = async(req,res,rext) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: `Restaurant not found with id ${req.params.restaurantId}` });
        }

        const ratings = await Rating.find({ restaurant: req.params.restaurantId });

        let totalRating = 0;

        ratings.forEach(rating => {
            totalRating += rating.rating;
        });

        const averageRating = totalRating / ratings.length;

        res.status(200).json({
            success: true,
            count: ratings.length,
            averageRating: averageRating.toFixed(2),
            data: ratings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

//@desc add Rating to restaurant
//@route POST /api/v1/reservations/reservationId/rating
//Private 
exports.addRating = async(req,res,next) => {
    try {
        const reservationId = req.params.reservationId;     
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: `No restaurant with the id of ${reservationId}` });
        }

        const restaurantId = reservation.restaurant;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: `No restaurant with the id of ${restaurantId}` });
        }
        existRating = await Rating.find({reservation : req.params.reservationId});
        if(existRating.length > 0) {
            return res.status(404).json({ success: false, message: `This reservation already rate this restaurant` });
        }
        
        req.body.reservation = reservationId;
        req.body.user = reservation.user;
        req.body.restaurant = restaurantId;
        
        const rating = await Rating.create(req.body);
        
        res.status(201).json({
            success: true,
            data: rating
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot Create Rating'
        });
    }
}

//@desc update Rating
//@route POST /api/v1/rating/:ratingId
//Private
exports.updateRating = async(req,res,next) => {
    try {
        console.log(req.params)
        const rating = await Rating.findByIdAndUpdate(req.params.ratingId,req.body,{
            new:true,
            runValidator:true
        });
        if(!rating) {
            return res.status(400).json({
                success:false,
                message : 'Cannot find Rating'
            });
        }
        res.status(200).json({success:true,data:rating});
    } catch (err) {
        res.status(400).json({
            success:false,
            message:'Cannot Update Rating'
        });
    }

}

//@desc remove Rating
//@route DELETE /api/v1/rating/ratingId
//Private
exports.deleteRating = async(req,res,next) => {
    try{
        const rating = await Rating.findById(req.params.ratingId);
        if(!rating){
            return res.status(404).json({
                success:false,
                message:'Cannot find Rating'
            });
        }
        await rating.deleteOne();
        res.status(200).json({success:true,data:{}});
    }catch(err){
        res.status(400).json({
            success:false,
            message:'Cannot Delete Rating'
        });
    }
}