"use client"
import { useState } from 'react';
import { useEffect } from 'react';

type PointShopProps = {
    profile: any;
    onCouponsUpdate: (coupons: { points: number; discount: number; count: number }[]) => void;
};

export default function PointShop({ profile, onCouponsUpdate }: PointShopProps) {

    const [selectedCoupons, setSelectedCoupons] = useState<{ points: number; discount: number; count: number }[]>([]);
    const [currentPoints, setCurrentPoints] = useState(0);

    useEffect(() => {
        if (profile) {
            setCurrentPoints(profile.data.points);
        }
    }, [profile]);

    // Function to handle buying a coupon
    const buyCoupon = (points: number, discount: number) => {
        if (currentPoints >= points) {
            // Check if the coupon already exists in the selectedCoupons array
            const existingCoupon = selectedCoupons.find((coupon) => coupon.discount === discount);
            if (existingCoupon) {
                // If the coupon exists, increment the count
                const updatedCoupons = selectedCoupons.map((coupon) =>
                    coupon.discount === discount ? { ...coupon, count: coupon.count + 1 } : coupon
                );
                setSelectedCoupons(updatedCoupons);
            } else {
                // If the coupon doesn't exist, add a new one with a count of 1
                setSelectedCoupons([...selectedCoupons, { points, discount, count: 1 }]);
            }
            onCouponsUpdate([...selectedCoupons, { points, discount, count: 1 }]);
            setCurrentPoints(currentPoints - points);
        }
    };

    // Function to remove a selected coupon
    const removeCoupon = (index: number) => {
        const updatedCoupons = [...selectedCoupons];
        const pointsToAddBack = updatedCoupons[index].points * updatedCoupons[index].count;
        updatedCoupons.splice(index, 1);
        setSelectedCoupons(updatedCoupons);
        onCouponsUpdate(updatedCoupons);
        setCurrentPoints(currentPoints + pointsToAddBack);
    };

    
    // Function to increase the count of a specific coupon
    const increaseCouponCount = (index: number) => {
        const updatedCoupons = [...selectedCoupons];
        updatedCoupons[index].count += 1;
        setSelectedCoupons(updatedCoupons);
        onCouponsUpdate(updatedCoupons);
    };
    
    // Function to decrease the count of a specific coupon
    const decreaseCouponCount = (index: number) => {
        const updatedCoupons = [...selectedCoupons];
        if (updatedCoupons[index].count > 1) {
            updatedCoupons[index].count -= 1;
            setSelectedCoupons(updatedCoupons);
            onCouponsUpdate(updatedCoupons);
        }
    };

    return (
        <div className="text-black w-full">
            {
                profile && (
                    <div>
                        <div className="w-full flex flex-col items-end px-4 pt-4">
                            <div className="text-lg font-bold">
                                {profile.data.name}
                            </div>
                            <div>
                                You have {currentPoints} points
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Coupons:</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <li className="bg-green-200 rounded-lg p-6">
                                    <strong className="block text-lg mb-2">Coupon -10 bath</strong>
                                    <p className="text-gray-600">200 points</p>
                                    <button onClick={() => buyCoupon(200, 10)} className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg block w-full">Buy</button>
                                </li>
                                <li className="bg-blue-200 rounded-lg p-6">
                                    <strong className="block text-lg mb-2">Coupon -30 bath</strong>
                                    <p className="text-gray-600">500 points</p>
                                    <button onClick={() => buyCoupon(500, 30)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg block w-full">Buy</button>
                                </li>
                                <li className="bg-yellow-200 rounded-lg p-6">
                                    <strong className="block text-lg mb-2">Coupon -50 bath</strong>
                                    <p className="text-gray-600">1000 points</p>
                                    <button onClick={() => buyCoupon(1000, 50)} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg block w-full">Buy</button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold my-4">Selected Coupons:</h2>
                            <div className='flex flex-col gap-2'>
                                {selectedCoupons.map((coupon, index) => (
                                    <div
                                        key={index}
                                        className={`flex justify-center items-center gap-3 p-3 rounded-lg ${
                                            coupon.discount === 10
                                                ? 'bg-green-200'
                                                : coupon.discount === 30
                                                ? 'bg-blue-200'
                                                : 'bg-yellow-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>-{coupon.discount} bath discount</span>
                                            <span className='flex gap-3 justify-center items-center'>
                                                <button onClick={() => decreaseCouponCount(index)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg">-</button>
                                                {coupon.count}x
                                                <button onClick={() => increaseCouponCount(index)} className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-lg">+</button>
                                            </span>
                                        </div>
                                        <button onClick={() => removeCoupon(index)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg">Remove</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
