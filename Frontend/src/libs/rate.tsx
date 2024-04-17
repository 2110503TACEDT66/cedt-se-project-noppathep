export default async function rate(id: string, token: string, rating: number, comment: string) {
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${id}/rating`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            rating: rating,
            comment: comment,
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
            throw new Error("Cannot add a rating");
        }
    }
    return await response.json();
}
