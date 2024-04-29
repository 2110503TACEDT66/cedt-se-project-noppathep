export default async function unrate(id: string, token: string) {
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${id}/rating`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        }
    });
    if (!response.ok) {
        setTimeout(() => {
            window.location.href = "/error"
          }, 2000);
        throw new Error("Cannot delete a rating");
    }

    return await response.json();
}