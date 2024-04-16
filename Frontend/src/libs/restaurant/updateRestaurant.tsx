import { RestaurantModel } from "../../../interface";

export default async function updateRestaurant(id: string, token: string, restaurant:RestaurantModel) {
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            name: restaurant.name,
            address: restaurant.address,
            tel: restaurant.tel,
            openingHours: restaurant.openingHours,
        })
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        try {
            const errorJson = JSON.parse(errorMessage);
            if (errorJson.message) {
                alert(errorJson.message);
                throw new Error(errorJson.message);
            } else {
                throw new Error("Unknown error occurred");
            }
        } catch (error) {
            console.error("Error parsing error message:", error);
            throw new Error("Cannot Update restaurant");
        }
    }
    return await response.json();
}
