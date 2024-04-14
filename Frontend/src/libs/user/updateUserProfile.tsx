export default async function updateUserProfile(id: string, token: string, newName:string, newEmail:string, newTel:string, newCard:string) {
    const response = await fetch(`http://localhost:5000/api/v1/auth/update`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            name: newName,
            email: newEmail,
            tel: newTel,
            card: newCard,
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
            throw new Error("Cannot Update user profile");
        }
    }
    return await response.json();
}
