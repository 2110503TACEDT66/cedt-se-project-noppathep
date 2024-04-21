export interface RestaurantModel {
    _id: string,
    name: string,
    owner: string,
    address:{
      district: string,
      province: string,
      postalcode: string,
      region: string
    },
    openingHours: {
      open: string,
      close: string
    },
    averageRating: number,
    tel: string,
    image:string
  }

export interface ReservationItem {
    _id:string
    user: string,
    restaurant : string,
    foodOrder : string[],
    apptDate : string
}

export interface userProfile{
  success:true,
  data:{
    name:string,
    role:string,
    email:string,
    tel:string,
    createdAt:Date,
  }
}

export interface Rating {
  rating: number
  user: string
  restaurant: string
  reservation: string
  comment: string
}