import Card from "./Card";
import Link from "next/link";
import getRestaurants from "@/libs/restaurant/getRestaurants";

export default async function CardPanel(){

    const RestaurantResponse = await getRestaurants()

    if(!RestaurantResponse) return (<p>Restaurant is Loading</p>)

    return(
    <main>
      <div className="flex flex-row flex-wrap mt-3 mb-5 gap-3 justify-center items-center">
        {
            RestaurantResponse.data.slice(0, 5).map((RestaurantItem:any)=>(
                <Link href={`/Restaurant/${RestaurantItem._id}`} className="w-[200px]">
                <Card RestaurantName={RestaurantItem.name} imgSrc={RestaurantItem.image} rating={RestaurantItem.averageRating}/>
                 </Link>
            ))
        }
      </div>
    </main>
    )
} 
