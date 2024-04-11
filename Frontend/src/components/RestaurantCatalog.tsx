import Link from "next/link";
import Card from "./Card";


export default  async function RestaurantCatalog({RestaurantsJson}:{RestaurantsJson:any}){
    const RestaurantReady = await RestaurantsJson 
    return(
        <>
        <div className="text-black">Just kidding... We only have {RestaurantReady.count} restaurant.</div>
        <div className="text-black">You can view the menu by clicking restaurant card .</div>
        <div style={{margin:"20px", display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-around",alignContent:"space-around"}}>
        {
            RestaurantReady.data.map((RestaurantItem:any)=>(
                <Link href={`/Restaurant/${RestaurantItem._id}`} className="w-1/5">
                <Card RestaurantName={RestaurantItem.name} imgSrc={RestaurantItem.image}/>
                 </Link>
            ))
        }
      </div>
        </>
    )
}