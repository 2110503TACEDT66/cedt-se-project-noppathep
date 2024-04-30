const mockReservation = [
    {
        _id: "reservation1",
        restaurant : "restaurant2",
        name: "superWhale",
        telephone: "0629292155",
        email: "foodOrderTest@gmail.com",
        points: 0,
        role: "user",
        createdAt: "2024-04-29T12:22:57.190Z",
        foodOrder:[
            "menuTest1",
            "menuTest1",
            "menuTest1",
            "menuTest1",
            "menuTest1",
            "menuTest2",
            "menuTest2",
            "menuTest2",
        ],
        __v: 0
    },
   
];

const Reservation = jest.fn().mockResolvedValue({
    data: mockReservation,
});

export default Reservation;
  