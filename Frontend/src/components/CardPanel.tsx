
import { useEffect, useReducer, useRef, useState } from "react";
import Card from "./Card";
import Link from "next/link";
import getRestaurants from "@/libs/restaurant/getRestaurants";

export default async function CardPanel(){

    const RestaurantResponse = await getRestaurants()
    console.log(RestaurantResponse)

    if(!RestaurantResponse) return (<p>Restaurant is Loading</p>)

    return(
    <main>
      <div className="flex flex-row flex-wrap mt-3 gap-3 justify-center items-center">
        {
            RestaurantResponse.data.map((RestaurantItem:any)=>(
                <Link href={`/Restaurant/${RestaurantItem._id}`} className="w-[200px]">
                <Card RestaurantName={RestaurantItem.name} imgSrc={RestaurantItem.image} rating={RestaurantItem.averageRating}/>
                 </Link>
            ))
        }
      </div>
    </main>
    )
} 
