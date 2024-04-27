'use client'
import getRestaurant from '@/libs/restaurant/getRestaurant';
import getMenu from '@/libs/restaurant/getMenu';
import Image from 'next/image';
import getReservation from '@/libs/reservation/getReservation';
import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import orderFood from '@/libs/orderFood';
import deleteOrder from '@/libs/deleteOrder';
import React from 'react';
import Swal from 'sweetalert2';

import PointShop from '@/components/PointShop';
import getUserProfile from '@/libs/user/getUserProfile';
import payReservation from '@/libs/reservation/payReservation';
import { useRouter } from 'next/navigation';
import updatePoint from '@/libs/user/updatePoint';

export default function Foodorder({params}:{params:{rid:string}}){

    //setup all state
    const router = useRouter();
    const { data: session, status } = useSession();
    const [RestaurantDetail, setRestaurantDetail] = useState<any>(null);
    const [MenuResponse, setMenuResponse] = useState<any>(null);
    const [reservation, setreservation] = useState<any>(null);
    const [editedOrder, setEditedOrder] = useState<Map<string,number>>(new Map());

    const [profile, setProfile] = useState<any>(null);

    //fetch all data need on first render
    useEffect(() => {
        const fetchData = async () => {
        console.log("finding");
        if (session) {
            const reservation = await getReservation(params.rid,session.user.token)
            setreservation(reservation)
            const restaurantID = reservation.data.restaurant
            const restaurant = await getRestaurant(restaurantID._id)
            setRestaurantDetail(restaurant)
            const menu= await getMenu(restaurant.data._id)
            setMenuResponse(menu)
            const profile = await getUserProfile(session.user.token);
            setProfile(profile);
            
            let amount = new Map<string,number>();
            reservation.data.foodOrder.map((item: any, index: number) => {
                if (!amount.get(item._id)) {
                    amount.set(item._id, 1);
                } else {
                    amount.set(item._id, amount.get(item._id)! + 1);
                }
            });
            setEditedOrder(new Map<string,number>(amount));


        } else {
            return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
        }
      };
      fetchData();
    }, []);


    const handleAdd = (item:any) => {
        const res = orderFood(reservation.data._id,session?session.user.token:"",item._id)
        res.then(result => {
            if(result.success) {
                //update dish amount on page
                const thisItem = editedOrder.get(item._id);
                if(thisItem){
                    setEditedOrder(new Map(editedOrder.set(item._id, thisItem + 1 )) )
                }else{ 
                    setEditedOrder(new Map(editedOrder.set(item._id, 1 ))) 
                }
       
            } else { alert("order failed") }
        })
    }
    const handleDelete = (item:any) => {

        //do nothing if id not existed in editedOrder
        const thisItem = editedOrder.get(item._id);

        if(!thisItem) return;

        const res = deleteOrder(reservation.data._id,session?session.user.token:"",item._id)
        res.then(result => {
            if(result.success) {
                //update dish amount on page
                if(editedOrder.get(item._id) == 1){
                    setEditedOrder(prev => {
                        const newMap = new Map<string,number>(prev);
                        newMap.delete(item._id);
                        return newMap;
                    })
                }else{
                    setEditedOrder(new Map(editedOrder.set(item._id, thisItem - 1 )) )
                }
            } else { alert("delete failed") }
        })
    }

    //mark reservation as 'paid' by calling backendAPI using payReservation() (for now)
    const handlePayReservation = async (reservationId:string) =>{
        Swal.fire({
            title: "Pay a reservation?",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor:"green"

          }).then((result) => {

            if (result.isConfirmed && session != null) {
                payReservation(reservationId,session.user.token)
                    .then((res)=>{
                        let currentPoints = profile.data.points;
                        selectedCoupons.forEach(coupon => {
                            currentPoints -= coupon.points;
                        });
                        updatePoint(session.user.token, currentPoints);
                        
                        //success popup
                        Swal.fire("Your payment has been recieved", `${res.message}</br>make sure to arrive in time!`, "success")
                        .then((result) =>{
                            if(result.isDismissed ||result.isConfirmed){
                                router.push('/myreservation');
                            }
                        });
                    })
                    .catch((err)=>{
                        //error popup
                        Swal.fire("ERROR",err.message, "error");
                    });

            } 
            else return;
          });
    }


    //==<total price/dishes>===
    const calculateTotalPrice = () => {
        let sum = 0;
        MenuResponse.data.forEach((item: any, index: number) => {
            if (editedOrder.get(item._id)) {
                sum += editedOrder.get(item._id)! * item.price;
            }
        });
    
        // Apply discounts based on selected coupons
        selectedCoupons.forEach((coupon) => {
            sum -= coupon.discount;
        });
    
        return sum > 0 ? sum : 0;
    }
    const calculateTotalItem = () => {
        let sum = 0;
        MenuResponse.data.forEach((item:any , index:number)=>{
            if(editedOrder.get(item._id)) {
                sum += editedOrder.get(item._id)!;
            }
        })
        return sum;
    }
    //====================================

    // New state variable to hold the selected coupons
    const [selectedCoupons, setSelectedCoupons] = useState<{ points: number; discount: number }[]>([]);

    // Callback function to receive updates from PointShop
    const handleCouponsUpdate = (coupons: { points: number; discount: number }[]) => {
        setSelectedCoupons(coupons);
    };

    //show loading until finish fetching
    if(!MenuResponse||!RestaurantDetail) return (<LinearProgress />);
    //redirect if already paid this reservation
    if(reservation.data.paid) router.replace('/myreservation');
    

    //get initial number of order and store in 'amount'
    let amount = new Map<string,number>();
    const amountInit = ()=>{
        reservation.data.foodOrder.map((item: any, index: number) => {
            if (!amount.get(item._id)) {
                amount.set(item._id, 1);
            } else {
                amount.set(item._id, amount.get(item._id)! + 1);
            }
        });
    }; amountInit();
    

    return(
        <main className="flex flex-col items-center text-center p-5 text-black">

            <h1 className="text-2xl font-bold mb-4">{RestaurantDetail.data.name}</h1>
            
            {
                MenuResponse.data.length!=0
                ?
                <div className="grid gap-x-5 gap-y-3 pb-5 w-full sm:w-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {
                MenuResponse.data.map((item:any, index:number)=>(
                    <div key={index} className="h-[150px] sm:w-[280px] sm:h-[320px] bg-white p-3 rounded-lg shadow-md flex sm:flex-col border-2 border-gray-100 items-center justify-around">
                        <div className="aspect-[16/10] content-center flex justify-center">
                            <Image src={item.image??'/img/placeholder.svg'} alt="Product Picture" width={200} height={200} 
                            className="self-start sm:self-center rounded-md "/>
                        </div>

                        <div className='w-[80%] flex flex-col flex-nowrap self-center items-center'>
                            <h3 className="text-lg font-semibold"> {item.name} </h3>
                            <h3 className="text-lg font-semibold"> {item.price} ฿</h3>
 
                            <div className='mt-1 w-fit h-fit relative flex flex-row flex-nowrap border-gray-200 border-[1px] rounded-sm '>

                                <button onClick={e => { handleDelete(item)} } className='hover:bg-gray-50 size-6'>-</button>
                                <div className='w-9 border-x-[1px] border-gray-300'>{editedOrder.get(item._id) ? editedOrder.get(item._id) : 0}</div>
                                <button onClick={e => { handleAdd(item)} } className='hover:bg-gray-50 size-6 '>+</button>
                                {
                                    editedOrder.get(item._id)
                                    ?<span className='absolute -right-14 font-medium text-red-700'>{(editedOrder.get(item._id)??0) * (item.price)} ฿</span>
                                    :''
                                }
                            </div>                            
                        </div>
                    </div>
                ))
                }
            </div>
            :<div className='w-full h-28 flex items-center justify-center bg-gray-50 text-gray-600'>
                <h2>Menu not available right now</h2>
            </div>

            }

            
            <div className='flex flex-nowrap w-full bg-teal-600 h-20 rounded-b-lg shadow-md border-2 pr-5'>
                <button className=' self-center ml-2 sm:ml-7 mr-auto size-fit bg-orange-500 hover:bg-orange-700 rounded-md font-semibold text-gray-200 p-2 transition-colors focus:ring-2 focus:ring-gray-200'
                    onClick={()=>handlePayReservation(params.rid)}>
                    Pay Now
                </button>
                <div className='ml-auto self-center'>
                    <div className='text-sm sm:text-base text-white h-fit w-fit font-semibold'>Total Items : {calculateTotalItem()}</div>
                    <div className='text-base sm:text-xl h-fit w-fit font-semibold text-white '>Total Price : {calculateTotalPrice()} ฿</div>
                </div>
            </div>

            <PointShop profile={profile} onCouponsUpdate={handleCouponsUpdate} />
        </main>
    );
}