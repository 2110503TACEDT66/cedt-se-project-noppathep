import Link from "next/link";
import Card from "./Card";


export default  async function RestaurantCatalog({RestaurantsJson}:{RestaurantsJson:any}){
    const RestaurantReady = await RestaurantsJson
    return(
        <>
        <div className="text-black">Just kidding... We only have {RestaurantReady.count} restaurant.</div>
        <div className="text-black">You can view the menu by clicking restaurant card .</div>
        <div className="flex flex-row flex-wrap mt-3 gap-3 justify-center items-center">
        {
            RestaurantReady.data.map((RestaurantItem:any)=>(
                <Link href={`/Restaurant/${RestaurantItem._id}`} className="w-[200px]">
                <Card RestaurantName={RestaurantItem.name} imgSrc={RestaurantItem.image} rating={RestaurantItem.averageRating}/>
                 </Link>
            ))
        }
      </div>
        </>
    )
}