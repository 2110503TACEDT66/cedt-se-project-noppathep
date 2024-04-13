'use client'

import { useRouter } from 'next/navigation';
import styles from './banner.module.css';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';


export default function Banner(){

    const router = useRouter()

    const {data:session} = useSession()
    
    return(
        <div className="block p-5 m-0 w-[100vw] h-[80vh] relative">
            <Image src='/img/cover.jpg'
                alt ='cover'
                fill ={true}
                objectFit = 'cover'
                className='brightness-50'/>
            <div className="absolute  left-7 top-12 text-start z-20 text-white">
                <h1 className='text-5xl font-medium'>World class Restautant is here</h1>
                <h3 className='text-2xl font-serif'>Reserve your seat for your Love one now</h3>
            </div>
            {
                session? <div className='z-30 absolute top-5 right-10 font-semibold text-cyan-50 text-xl'>Welcome {session.user.name}</div> 
                : <div className='z-30 absolute top-5 right-10 font-semibold text-cyan-800 text-xl'>Please login to reserve a seat</div>
            }
            <button className="bg-white text-cyan-600 border border-cyan-600 font-semibold mr-8
            py-2 px-2 m-2 round z-30 absolute bottom-5 right-0 hover:bg-cyan-600 hover:text-white hover:border-transparent transition-colors"
            onClick={()=>{router.push('/Restaurant')}}>
                Click here for more Restaurant
            </button>
        </div>
    )
} 