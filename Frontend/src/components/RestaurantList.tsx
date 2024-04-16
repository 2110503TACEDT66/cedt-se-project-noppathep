import Link from "next/link";
import Card from "./Card";

export default async function RestaurantList({ RestaurantsJson }: { RestaurantsJson: any }) {
    const RestaurantReady = await RestaurantsJson;

    return (
        <>
            <div className="text-black">You have {RestaurantReady.count} restaurants.</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {RestaurantReady.data.map((RestaurantItem: any) => (
                    <Link href={`/Restaurant/${RestaurantItem._id}`} key={RestaurantItem._id}>
                        <div className="flex justify-center">
                            <Card RestaurantName={RestaurantItem.name} imgSrc={RestaurantItem.image} />
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
