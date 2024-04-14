'use client'
import getRestaurant from '@/libs/restaurant/getRestaurant';
import getMenu from '@/libs/restaurant/getMenu';
import Image from 'next/image';
import getReservation from '@/libs/reservation/getReservation';
import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import orderFood from '@/libs/reservation/orderFood';
import deleteOrder from '@/libs/reservation/deleteOrder';


export default function Foodorder({params}:{params:{rid:string}}){
    const { data: session, status } = useSession();
    const [RestaurantDetail, setRestaurantDetail] = useState<any>(null);
    const [MenuResponse, setMenuResponse] = useState<any>(null);
    const [reservation, setreservation] = useState<any>(null);

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
                alert("order successfully")
                window.location.reload();
            } else {
                alert("order failed")
            }
        })
    }

    const handleDelete = (item:any) => {
        const res = deleteOrder(reservation.data._id,session?session.user.token:"",item._id)
        res.then(result => {
            if(result.success) {
                alert("delete successfully")
                window.location.reload();
            } else {
                alert("delete failed")
            }
        })
    }

    if(!MenuResponse||!RestaurantDetail) return (<p className='text-black text-xl text-center'>Menu is Loading ... <LinearProgress /></p>)

    let amount = new Map<string,number>();

    reservation.data.foodOrder.map((item: any, index: number) => {
        if (!amount.get(item._id)) {
            amount.set(item._id, 1);
        } else {
            amount.set(item._id, amount.get(item._id)! + 1);
        }
    });

    return(
        <main className="flex flex-col items-center text-center p-5 text-black">
            <h1 className="text-lg font-medium">{RestaurantDetail.data.name}</h1>
            <div className="grid grid-cols-3 gap-2 w-fit">
                {
                MenuResponse.data.map((item:any, index:number)=>(
                    <div key={index} className="w-[280px] h-[250px] bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                        <div className="aspect-w-16 aspect-h-9 content-center flex justify-center">
                            <Image src={item.image} alt="Product Picture" width={300} height={300} 
                            className="size-14 self-start sm:self-center rounded-full sm:mt-0 sm:rounded-none sm:w-[150px] sm:h-auto"/>
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            <h3 className="text-lg font-semibold">{item.name} : {item.price} ฿</h3>
                            <div className='text-lg text-black'>Amount : {amount.get(item._id) ? amount.get(item._id) : 0}</div>
                            <div className='space-x-4'>
                                <button className="rounded-md bg-green-600 hover:bg-cyan-300 px-3 py-1 text-white shadow-sm" 
                                onClick={() => handleAdd(item)}>
                                    Add order
                                </button>
                                <button className="rounded-md bg-red-600 hover:bg-red-900 px-3 py-1 text-white shadow-sm" 
                                onClick={() => handleDelete(item)}>
                                    Cancel order
                                </button>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </main>
    );
}