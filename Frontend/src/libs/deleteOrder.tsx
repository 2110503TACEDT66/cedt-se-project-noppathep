export default async function deleteOrder(id: string, token: string, food: string) {
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${id}/${food}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
    });
    if (!response.ok) {
        throw new Error("Cannot delete Order")
    }
    return await response.json();

}