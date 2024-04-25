'use client';
import getRestaurant from '@/libs/restaurant/getRestaurant';
import getTable from '@/libs/restaurant/getTable';
import pickTable from '@/libs/pickTable';
import getReservation from '@/libs/reservation/getReservation';
import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function Table({ params }: { params: { rid: string } }) {
  // Setup all state
  const { data: session } = useSession();
  const [RestaurantDetail, setRestaurantDetail] = useState<any>(null);
  const [TableResponse, setTableResponse] = useState<any>(null);
  const [reservation, setReservation] = useState<any>(null);
  const [pickedTables, setPickedTables] = useState(new Set<string>());

  // Fetch data on first render
  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const reservation = await getReservation(params.rid, session.user.token);
        setReservation(reservation);

        const restaurantID = reservation.data.restaurant;
        const restaurant = await getRestaurant(restaurantID._id);
        setRestaurantDetail(restaurant);

        const table = await getTable(restaurant.data._id, session ? session.user.token : '');
        setTableResponse(table);
      } else {
        return (
          <p className="text-black text-xl text-center">
            Please go back and login ... <LinearProgress />
          </p>
        );
      }
    };

    fetchData();
  }, [params.rid, session]);

  const handlePick = async (item: any) => {
    const res = await pickTable(reservation.data._id, session ? session.user.token : '', item._id);
    if (res.success) {
      // Add to set to indicate the table is picked
      setPickedTables((prev) => new Set([...prev, item._id]));
    } else {
      alert('Pick failed');
    }
  };

  // Show loading until data is fetched
  if (!TableResponse || !RestaurantDetail) return <LinearProgress />;

  return (
    <main className="flex flex-col items-center text-center p-5 text-black">
      <h1 className="text-2xl font-medium mb-4">{RestaurantDetail.data.name}</h1>

      <div className="grid gap-x-5 gap-y-3 w-full sm:w-fit grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 xl-grid-cols-4 2xl-grid-cols-5">
        {TableResponse.data.map((item: any, index: number) => {
          const isPicked = pickedTables.has(item._id); // Check if this table has been picked

          return (
            <div
              key={index}
              className={`h-[150px] sm:w-[280px] sm:h-[320px] ${
                isPicked ? 'bg-red-500' : 'bg-white'
              } p-3 rounded-lg shadow-md flex sm:flex-col border-2 border-gray-100 items-center justify-around`}
            >
              <div className="aspect-[16/10] content-center flex justify-center">
                <h3 className="text-lg font-semibold">Number of seats</h3>
              </div>
              <h3 className="text-lg font-semibold">{item.size}</h3>

              <div className="w-[80%] flex flex-col self-center items-center">
                {isPicked && <p className="text-red-700 font-semibold">Picked</p>}
                <button
                  onClick={() => {
                    handlePick(item); // Pick the table when button is clicked
                  }}
                  className={`rounded-md ${
                    isPicked ? 'bg-red-700' : 'bg-green-600 hover:bg-orange-700'
                  } px-2 py-1 text-white shadow-sm`}
                >
                  Pick the table
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
