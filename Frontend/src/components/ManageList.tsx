import getReservations from "@/libs/reservation/getReservations";
import ReservationList from "./ReservationList";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { LinearProgress } from "@mui/material";
import RestaurantList from "./RestaurantList";
import getRestaurants from "@/libs/restaurant/getRestaurants";

export default async function ManageList({profile}:{profile:any}) {
    const session = await getServerSession(authOptions);
    if (!session) return <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;

    const allReservations = await getReservations(session.user.token);
    const allRestaurants = await getRestaurants();

    return (
        <main>
            <div className="text-black flex flex-col">
                <RestaurantList RestaurantsJson={allRestaurants}></RestaurantList>
            </div>
        </main>
    );
}