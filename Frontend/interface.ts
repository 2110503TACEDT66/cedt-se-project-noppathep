export interface RestaurantModel {
    _id: string,
    name: string,
    address:{
      district: string,
      province: string,
      postalcode: string,
      region: string
    },
    openingHours: {
      open: string,
      close: string
  }
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