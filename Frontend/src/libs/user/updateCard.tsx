import { Creditcard } from "@/Creditcard";

export default async function updateCard(token: string, card:Creditcard[]) {
    const response = await fetch(`http://localhost:5000/api/v1/auth/update`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            card: card
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
            throw new Error("Cannot Update Card");
        }
    }
    return await response.json();
}
