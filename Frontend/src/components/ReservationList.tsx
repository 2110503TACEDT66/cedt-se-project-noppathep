"use client"
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import deleteReservation from '@/libs/reservation/deleteReservation';
import dayjs from "dayjs";
import { Session } from "next-auth";
import { Button } from "@mui/material";
import { getSession } from 'next-auth/react';

export default function ReservationList({ reservationJson }: { reservationJson: any }) {
    const [session, setSession] = useState<Session|null>(null);
    const reservations = reservationJson;

    useEffect(() => {
        const fetchSession = async () => {
            const serverSession = await getSession();
            setSession(serverSession);
        };
        fetchSession();
    }, []);

    const handleDelete = async (rid: string) => {
        Swal.fire({
            title: "Do you want to delete this reservation?",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Sure, delete it",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteReservation(rid, session?.user.token || "");
                Swal.fire("Reservation Deleted!", "", "success");
                window.location.reload();
            }
        });
    };

    return (
        <div className="w-full flex flex-col bg-slate-100 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.map((item: any) => (
                    <div key={item._id} className="bg-slate-200 rounded-lg p-3 flex flex-col items-start relative">
                        <div className="mb-2">
                            <strong>User ID:</strong> {item.user}
                        </div>
                        <div className="mb-2">
                            <strong>Restaurant:</strong> {item.restaurant.name}
                        </div>
                        <div className="mb-2">
                            <strong>Date:</strong> {dayjs(item.apptDate).format("DD/MM/YYYY HH:mm")}
                        </div>
                        <div className="mb-2">
                            <strong>Order Count:</strong> {item.foodOrder.length}
                        </div>
                        {session && (
                            <Button
                                variant="contained"
                                color="error"
                                className="absolute right-2 bottom-2 bg-red-600"
                                onClick={() => handleDelete(item.restaurant)}
                            >
                                Delete Reservation
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
