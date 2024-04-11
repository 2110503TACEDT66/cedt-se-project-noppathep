import { Dayjs } from "dayjs"


export default async function createdReservation(id: string, token: string, apptDate: Dayjs, user: string) {
    apptDate = apptDate.add(7, 'hour');

    const response = await fetch(`https://presentation-day-1-f.vercel.app/api/v1/restaurants/${id}/reservations`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            apptDate: apptDate,
            user: user
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
            throw new Error("Cannot create reservation");
        }
    }
    return await response.json();
}
