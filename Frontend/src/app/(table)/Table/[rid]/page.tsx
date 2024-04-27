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
  const { data: session } = useSession();
  const [RestaurantDetail, setRestaurantDetail] = useState<any>(null);
  const [TableResponse, setTableResponse] = useState<any>(null);
  const [reservation, setReservation] = useState<any>(null);
  const [reservedTables, setReservedTables] = useState(new Set<string>());

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

        // Add reserved tables from backend reservation
        setReservedTables(new Set(reservation.data.reserveTable));
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
    const confirmed = confirm("Are you sure you want to pick this table?");
    if (!confirmed) {
      return; // If the user does not confirm, do nothing
    }
    if (reservedTables.has(item._id)) {
      console.warn("This table is already reserved."); // Prevent further action if the table is reserved
      return; // If the table is already reserved, don't try to pick it
    }

    const res = await pickTable(reservation.data._id, session ? session.user.token : '', item._id);
    if (res.success) {
      // Add the picked table ID to the reservedTables set
      setReservedTables((prev) => {
        const newSet = new Set(prev);
        newSet.add(item._id);
        return newSet;
      });
    }
  };

  if (!TableResponse || !RestaurantDetail) return <LinearProgress />;

  return (
    <main className="flex flex-col items-center text-center p-5 text-black">
      <h1 className="text-2xl font-medium mb-4">{RestaurantDetail.data.name}</h1>

      <div className="grid gap-x-5 gap-y-3 w-full grid-cols-5">
        {TableResponse.data.map((item: any, index: any) => {
          const isReserved = reservedTables.has(item._id);

          return (
            <div
              key={index}
              className={`h-[150px] w-[280px] sm:h-[320px] ${
                isReserved ? 'bg-red-500' : 'bg-white'
              } p-3 rounded-lg shadow-md flex flex-col border-2 border-gray-100 items-center justify-around`}
            >
              <h3 className="text-lg font-semibold">Number of seats: {item.size}</h3>

              <div className="w-[80%] flex flex-col self-center items-center">
                {isReserved && <p className="text-red-700 font-semibold">Already Picked</p>}
                <button
                  onClick={() => handlePick(item)}
                  disabled={isReserved} // Disable button if it's reserved
                  className={`rounded-md ${
                    isReserved ? 'bg-red-700 cursor-not-allowed' : 'bg-green-600 hover:bg-orange-700'
                  } px-2 py-1 text-white shadow-sm`}
                >
                  {isReserved ? 'Already Reserved' : 'Pick the Table'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
