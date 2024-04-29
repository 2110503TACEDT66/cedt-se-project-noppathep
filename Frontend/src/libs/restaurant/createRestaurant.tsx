import { RestaurantModel } from "../../../interface";

export default async function createRestaurant(token:string, newRestaurant:RestaurantModel){
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            name: newRestaurant.name,
            owner: newRestaurant.owner,
            address: newRestaurant.address,
            tel: newRestaurant.tel,
            openingHours: newRestaurant.openingHours,
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
            setTimeout(() => {
                window.location.href = "/error"
              }, 2000);
            throw new Error("Cannot create reservation");
        }
    }
    return await response.json();
}