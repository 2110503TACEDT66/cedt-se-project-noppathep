import { Dayjs } from "dayjs"

export default async function updateReservation(id: string, token: string, apptDate: Dayjs) {
    // if(apptDate) {
    //     apptDate = apptDate.add(7, 'hour');
    // }
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            apptDate: apptDate
        })
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        try {
            const errorJson = JSON.parse(errorMessage);
            if (errorJson.message) {
                throw new Error(errorJson.message);
            } else {
                throw new Error("Unknown error occurred");
            }
        } catch (error:any) {
            console.error("Error parsing error message:", error);
            setTimeout(() => {
                window.location.href = "/error"
              }, 2000);
            throw new Error(error.message);
        }
    }
    return await response.json();
}
