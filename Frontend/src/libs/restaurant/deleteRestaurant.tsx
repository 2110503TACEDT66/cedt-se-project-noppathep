export default async function deleteRestaurant(token:string, rid:string){
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${rid}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
    });

    if (!response.ok) {
        setTimeout(() => {
            window.location.href = "/error"
          }, 2000);
        throw new Error("Cannot delete restaurant");
    }

    return await response.json();
}