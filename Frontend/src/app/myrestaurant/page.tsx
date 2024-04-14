import LinearProgress from '@mui/material/LinearProgress';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getUserProfile from '@/libs/user/getUserProfile';

export default async function myRestaurant() {
    const session = await getServerSession(authOptions);
    let profile = null;

    if (session && !(session.user.role === "user")) {
        profile = await getUserProfile(session.user.token);
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    return (
        <main>
            <Suspense fallback={<p className='text-black text-xl text-center' >Loading ... <LinearProgress /></p>}>
                <div>Placeholder</div>
            </Suspense>
        </main>
    );
}