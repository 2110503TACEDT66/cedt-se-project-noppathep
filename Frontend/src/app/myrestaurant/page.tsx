import LinearProgress from '@mui/material/LinearProgress';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getUserProfile from '@/libs/user/getUserProfile';
import MyRestaurant from '@/components/MyRestaurant';

export default async function myRestaurant() {
    const session = await getServerSession(authOptions);
    let profile = null;


    if (session) {
        profile = await getUserProfile(session.user.token);
        if (profile.data.role == "user") return <p className='text-black text-xl text-center'>Unauthorized ... <LinearProgress /></p>;
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    return (
        <main>
            <Suspense fallback={<p className='text-black text-xl text-center' >Loading ... <LinearProgress /></p>}>
                <MyRestaurant profile={profile}></MyRestaurant>
            </Suspense>
        </main>
    );
}