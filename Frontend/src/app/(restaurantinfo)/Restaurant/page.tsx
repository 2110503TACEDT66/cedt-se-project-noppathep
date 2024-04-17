import CardPanel from '@/components/CardPanel'
import RestaurantCatalog from '@/components/RestaurantCatalog'
import getRestaurants from '@/libs/restaurant/getRestaurants'
import { LinearProgress } from '@mui/material'
import { Suspense } from 'react'

export default async function Restaurant(){

    const Restaurants = await getRestaurants()

    return(
        <main className="text-center p-5">
            <h1 className="text-xl font-medium text-black">Select your Restaurant</h1>
                <RestaurantCatalog RestaurantsJson={Restaurants}/>
        </main>
    )
}