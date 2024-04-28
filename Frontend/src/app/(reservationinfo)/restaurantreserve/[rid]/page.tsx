import ReservationList from "@/components/ReservationList";
import getRestaurant from "@/libs/restaurant/getRestaurant";
import getUserProfile from "@/libs/user/getUserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LinearProgress } from "@mui/material";
import { Suspense } from "react";

export default async function restaurantReserve({params}:{params:{rid:string}}) {
    const session = await getServerSession(authOptions);
    let profile = null;
    let restaurant = null;

    if (session) {
        profile = await getUserProfile(session.user.token);
        if (profile == "user") return <p className='text-black text-xl text-center'>Unauthorized ... <LinearProgress /></p>;
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    try {
        restaurant = await getRestaurant(params.rid);

        console.log("Restaurant:", restaurant);
    } catch (error) {
        console.error("Error fetching data:", error);
    }


    return(
        <main>
            <Suspense fallback={<p className='text-black text-xl text-center' >Loading ... <LinearProgress /></p>}>
                    <div className="mt-5 px-2 text-black shadow-sm relative text-2xl font-semibold text-start sm:text-center">
                        {restaurant.data.name}'s Reservation
                        <div className='text-left text-sm font-medium sm:text-center text-gray-600 my-4'>
                            Reservation Count: {restaurant.data.reservations.length}
                        </div>

                        {/* Pass reservations data to ReservationList component */}
                        <ReservationList dataJson={restaurant.data}/>
                    </div>
            </Suspense>
        </main>
    );
}
