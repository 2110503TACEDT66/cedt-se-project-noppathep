export default async function pickTable(id: string, token: string, table: string) {
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${id}/tables`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: table }),
    });

    if (!response.ok) {
        const errorText = await response.text();

        // Try to parse JSON response to identify the error message
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.message) {
                // Display the error message in an alert to inform the user
                alert(errorJson.message);
                return { success: false }; // Indicate the operation was unsuccessful
            }
        } catch (e) {
            // If JSON parsing fails, fall back to raw text error message
            alert(`An error occurred: ${errorText}`);
            return { success: false }; // Indicate the operation failed
        }
    }

    // If successful, return the parsed JSON response
    const data = await response.json();
    return { success: true, ...data };
}
