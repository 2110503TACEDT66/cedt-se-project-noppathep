export default async function deleteOrder(id: string, token: string, food: string) {
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${id}/${food}`, {
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
        throw new Error("Cannot delete Order")
    }
    return await response.json();

}