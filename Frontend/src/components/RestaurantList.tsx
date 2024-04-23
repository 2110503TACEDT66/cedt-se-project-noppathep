import Link from "next/link";
import Card from "./Card";

export default async function RestaurantList({ RestaurantsJson }: { RestaurantsJson: any }) {
    const RestaurantReady = await RestaurantsJson;

    return (
        <div>
            <div className="text-black text-center my-3 text-lg">There are <strong>{RestaurantReady.count}</strong> restaurants</div>
            <div className="flex flex-row flex-wrap gap-4 items-center justify-center">
                {RestaurantReady.data.map((RestaurantItem: any) => (
                    <Link href={`/Restaurant/${RestaurantItem._id}`} key={RestaurantItem._id}>
                        <div className="w-[200px] flex justify-center">
                            <Card RestaurantName={RestaurantItem.name} imgSrc={RestaurantItem.image} rating={RestaurantItem.averageRating}/>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
