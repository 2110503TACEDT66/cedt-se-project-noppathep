const Reservation = require('../models/Reservation');
const Restaurant  = require('../models/Restaurant');
const Rating = require('../models/Rating');

//@desc get Rating in restaurant
//@route GET /api/v1/restaurants/:restaurantId/rating
//Private
exports.getRatingByRestaurant = async(req,res,rext) => {
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

exports.getRatingByReservation = async(req,res,rext) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.reservationId}` });
        } 
        const rating = await Rating.findOne({ reservation: req.params.reservationId });
        if(rating == null) {
            return res.status(404).json({ success: false, message: `No rating with the reservationid of ${req.params.reservationId}` });
        }
        res.status(200).json({
            success: true,
            data: rating
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

//@desc add Rating
//@route PUT /api/v1/reservations/:reservationId/rating
//Private
exports.addRating = async(req,res,next) => {
    try {
        const reservationId = req.params.reservationId;     
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: `No restaurant with the id of ${reservationId}` });
        }
        const rating = await Rating.findOne({ reservation : reservationId });       
        if(!rating) {
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
            console.log("yes");
        //update Restaurant.rating
            const RestaurantRate = await Restaurant.findById(reservation.restaurant).populate('rating');
            console.log(RestaurantRate.averageRating);
            console.log(reservation.restaurant);
            let totalRating = 0;
            RestaurantRate.rating.forEach(rate => {
                totalRating += rate.rating;
            });
            const averageRating = totalRating / RestaurantRate.rating.length;
            
            const newRestaurantRate = await Restaurant.findByIdAndUpdate(
                reservation.restaurant,
                {averageRating:averageRating.toFixed(2)},
            {
                new:true,
                runValidator:true
            });
            console.log(newRestaurantRate.averageRating);
        // 
            return res.status(200).json({
                success: true,
                data: rating
            });
        }
        const updateRating = await Rating.findByIdAndUpdate(rating._id, req.body,{
            new: true,
            runValidator:true
        });
        //update Restaurant.rating
            const RestaurantRate = await Restaurant.findById(reservation.restaurant).populate('rating');
            console.log(RestaurantRate.averageRating);
            console.log(reservation.restaurant);
            let totalRating = 0;
            RestaurantRate.rating.forEach(rate => {
                totalRating += rate.rating;
            });
            const averageRating = totalRating / RestaurantRate.rating.length;
            
            const newRestaurantRate = await Restaurant.findByIdAndUpdate(
                reservation.restaurant,
                {averageRating:averageRating.toFixed(2)},
            {
                new:true,
                runValidator:true
            });
            console.log(newRestaurantRate.averageRating);
        //
        return res.status(200).json({success: true, data: updateRating});

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success:false,
            message:'Cannot Add Rating'
        });
    }

}

//@desc remove Rating
//@route DELETE /api/v1/rating/ratingId
//Private
exports.deleteRating = async(req,res,next) => {
    try{
        const reservationId = req.params.reservationId;     
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${reservationId}` });
        }
        const rating = await Rating.find({ reservation : reservationId });
        if(!rating) {
            return res.status(400).json({
                success:false,
                message : 'Cannot find Rating'
            });
        }
        const deleterating = await Rating.findById(rating[0]);
        await deleterating.deleteOne();
        //update Restaurant.rating
        const RestaurantRate = await Restaurant.getRestaurant(reservation.restaurant);
        console.log(RestaurantRate.averageRating);
        let totalRating = 0;
        RestaurantRate.rating.forEach(rate => {
            totalRating += rate.rating;
        });
        const averageRating = totalRating / RestaurantRate.rating.length;

        await Restaurant.findByIdAndUpdate(reservation.restaurant,{averageRating:averageRating.toFixed(2)},{
            new:true,
            runValidator:true
        });
        console.log(RestaurantRate.averageRating);
        //
        return res.status(200).json({success:true,data:{}});
    }catch(err){
        res.status(500).json({
            success:false,
            message:'Cannot Delete Rating'
        });
    }
}