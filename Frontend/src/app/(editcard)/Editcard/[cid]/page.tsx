import CardPanel from '@/components/CardPanel'
import EditCard from '@/components/EditCard'
import RestaurantCatalog from '@/components/RestaurantCatalog'
import getRestaurants from '@/libs/getRestaurants'
import { LinearProgress } from '@mui/material'
import { Suspense } from 'react'

export default async function Edit(){


    return(
        <main>
                <EditCard/>
        </main>
    )
}