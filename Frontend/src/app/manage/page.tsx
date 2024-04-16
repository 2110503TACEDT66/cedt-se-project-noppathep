import LinearProgress from '@mui/material/LinearProgress';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getUserProfile from '@/libs/user/getUserProfile';
import ManageList from '@/components/ManageList';

export default async function manage() {
    const session = await getServerSession(authOptions);
    let profile = null;

    if (session) {
        profile = await getUserProfile(session.user.token);
        if (profile.data.role !== "admin") return <p className='text-black text-xl text-center'>Unauthorized ... <LinearProgress /></p>;
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    return (
        <main>
            <Suspense fallback={<p className='text-black text-xl text-center' >Loading ... <LinearProgress /></p>}>
                <ManageList profile={profile}></ManageList>
            </Suspense>
        </main>
    );
}