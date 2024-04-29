// __mocks__/getRestaurants.ts
import { RestaurantModel } from "../interface";

const mockRestaurants: RestaurantModel[] = [
  { _id: '1', name: 'Restaurant A', address: { district: 'District A', province: 'Province A', postalcode: '12345', region: 'Region A' }, tel: '123456789', averageRating: 4.5, openingHours: { open: '09:00', close: '21:00' }, image: 'image-a.jpg', owner: "null" },
  { _id: '2', name: 'Restaurant B', address: { district: 'District B', province: 'Province B', postalcode: '54321', region: 'Region B' }, tel: '987654321', averageRating: 4.2, openingHours: { open: '10:00', close: '22:00' }, image: 'image-b.jpg', owner: "null" },
];

export default async function getRestaurants(): Promise<{ data: RestaurantModel[] }> {
  return { data: mockRestaurants };
}