"use client"

export default function PointShop({ profile }: { profile: any }) {
    // Function to handle buying a coupon
    const buyCoupon = (points: number, discount: number) => {
        // TODO : buy coupon backend(?)
        console.log(`You have successfully bought a coupon with ${points} points and received a discount of ${discount} bath.`);
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
                                You have {profile.data.points} points
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Coupons:</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <li className="bg-green-200 rounded-lg p-6">
                                    <strong className="block text-lg mb-2">Couple -10 bath</strong>
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
                    </div>
                )
            }
        </div>
    );
}
