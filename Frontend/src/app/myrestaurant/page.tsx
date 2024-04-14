import LinearProgress from '@mui/material/LinearProgress';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getUserProfile from '@/libs/user/getUserProfile';
import RestaurantList from '@/components/RestaurantList';

export default async function myRestaurant() {
    const session = await getServerSession(authOptions);
    let profile = null;


    if (session) {
        profile = await getUserProfile(session.user.token);
        if (profile == "user") return <p className='text-black text-xl text-center'>Unauthorized ... <LinearProgress /></p>;
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    return (
        <main>
            <Suspense fallback={<p className='text-black text-xl text-center' >Loading ... <LinearProgress /></p>}>
                <RestaurantList></RestaurantList>
            </Suspense>
        </main>
    );
}