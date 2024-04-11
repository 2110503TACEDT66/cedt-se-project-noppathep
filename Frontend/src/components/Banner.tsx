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
        <div className={styles.banner}>
            <Image src='/img/cover.jpg'
                alt ='cover'
                fill ={true}
                objectFit = 'cover'/>
            <div className={styles.bannerText}>
                <h1 className='text-4xl font-medium'>World class Restautant is here now</h1>
                <h3 className='text-1xl font-serif'>Reserve your seat for your Love one now</h3>
            </div>
            {
                session? <div className='z-30 absolute top-5 right-10 font-semibold text-cyan-800 text-xl'>Welcome {session.user.name}</div> 
                : <div className='z-30 absolute top-5 right-10 font-semibold text-cyan-800 text-xl'>Please login to reserve a seat</div>
            }
            <button className="bg-white text-cyan-600 border border-cyan-600 font-semobold mr-8
            py-2 px-2 m-2 round z-30 absolute bottom-0 right-0 hover:bg-cyan-600 hover:text-white hover:border-transparent"
            onClick={()=>{router.push('/Restaurant')}}>
                Click here for more Restaurant
            </button>
        </div>
    )
} 