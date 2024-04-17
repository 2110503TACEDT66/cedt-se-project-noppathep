export default async function deleteRestaurant(token:string, rid:string){
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${rid}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
    });

    if (!response.ok) {
        throw new Error("Cannot delete restaurant");
    }

    return await response.json();
}