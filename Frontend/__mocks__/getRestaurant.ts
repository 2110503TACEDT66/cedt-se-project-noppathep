// File: __mocks__/getRestaurants.ts

const mockRestaurants = [
  {
    _id: 'restaurant1',
    name: 'Restaurant 1',
    address: {
      district: 'District 1',
      province: 'Province 1',
      postalcode: '12345',
      region: 'Region 1',
    },
    tel: '123456789',
    averageRating: 4.5,
    openingHours: {
      open: '09:00',
      close: '21:00',
    },
    image: 'restaurant1.jpg',
  },
  {
    _id: 'restaurant2',
    name: 'Restaurant 2',
    address: {
      district: 'District 1',
      province: 'Province 1',
      postalcode: '12345',
      region: 'Region 2',
    },
    tel: '123456789',
    averageRating: 5,
    openingHours: {
      open: '10:00',
      close: '21:00',
    },
    image: 'restaurant2.jpg',
  },

  // Add more mock restaurant data as needed
];

const getRestaurants = jest.fn().mockResolvedValue({
  data: mockRestaurants,
});

export default getRestaurants;
