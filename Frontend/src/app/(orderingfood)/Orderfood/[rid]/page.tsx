'use client'
import getRestaurant from '@/libs/restaurant/getRestaurant';
import getMenu from '@/libs/restaurant/getMenu';
import Image from 'next/image';
import getReservation from '@/libs/reservation/getReservation';
import { LinearProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import orderFood from '@/libs/orderFood';
import deleteOrder from '@/libs/deleteOrder';
import React from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import PointShop from '@/components/PointShop';
import getUserProfile from '@/libs/user/getUserProfile';

export default function Foodorder({params}:{params:{rid:string}}){

    //setup all state
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


    //==<total price/dishes>===
    const calculateTotalPrice = () => {
        let sum = 0;
        MenuResponse.data.forEach((item:any , index:number)=>{
            if(editedOrder.get(item._id)) {
                sum += editedOrder.get(item._id)! * item.price;
            }
        })
        return sum;
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

    //show loading until finish fetching
    if(!MenuResponse||!RestaurantDetail) return (<LinearProgress />)


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

            <h1 className="text-2xl font-medium mb-4">{RestaurantDetail.data.name}</h1>
            
            <div className="grid gap-x-5 gap-y-3 w-full sm:w-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {
                MenuResponse.data.map((item:any, index:number)=>(
                    <div key={index} className="h-[150px] sm:w-[280px] sm:h-[320px] bg-white p-3 rounded-lg shadow-md flex sm:flex-col border-2 border-gray-100 items-center justify-around">
                        <div className="aspect-[16/10] content-center flex justify-center">
                            <Image src={item.image} alt="Product Picture" width={300} height={300} 
                            className=" self-start w-40 h-auto sm:w-auto  sm:self-center rounded-md "/>
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

            
            <div className='flex flex-nowrap flex-col w-full mt-5 bg-teal-600 h-20 rounded-b-lg shadow-md border-2 justify-center items-end pr-5'>
                <div className='text-sm sm:text-base text-white h-fit w-fit font-semibold'>Total Items : {calculateTotalItem()}</div>
                <div className='text-base sm:text-xl h-fit w-fit font-semibold text-white '>Total Price : {calculateTotalPrice()} ฿</div>
            </div>

            <PointShop profile={profile} />
        </main>
    );
}