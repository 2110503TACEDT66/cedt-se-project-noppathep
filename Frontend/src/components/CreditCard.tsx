'use client'
import React, { useState } from 'react';

export default function CreditCard() {
    const [cardNumber, setCardNumber] = useState('################');
    const [cardHolder, setCardHolder] = useState('');
    const [expMonth, setExpMonth] = useState('MM');
    const [expYear, setExpYear] = useState('YY');
    const [cvv, setCvv] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(event.target.value);
    };

    const handleCardHolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardHolder(event.target.value);
    };

    const handleExpMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExpMonth(event.target.value);
    };

    const handleExpYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExpYear(event.target.value);
    };

    const handleCvvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCvv(event.target.value);
    };

    const handleCvvHover = () => {
        setIsFlipped(true);
    };

    const handleCvvLeave = () => {
        setIsFlipped(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col pb-16">
            <div className={`bg-gradient-to-r from-emerald-600 to-emerald-300 relative h-[250px] -mb-40 w-[400px] mt-20 rounded ${isFlipped ? 'flipped' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl p-5 transform perspective-1000 rotate-y-0 transition-transform duration-400 ease-out">
                    <div className="image flex flex-row">
                        <img src="img/chip.png" alt="" className="w-[15%] h-[15%]" />
                        <img src="img/visa.png" alt="" className="w-[20%] h-[20%] ml-60" />
                    </div>
                    <div className="mt-5">{cardNumber}</div>
                    <div className="flexbox">
                        <div className="mt-2">
                            <span>CARD HOLDER</span>
                            <div className="card-holder-name">{cardHolder}</div>
                        </div>
                        <div className="mt-5">
                            <span>EXPIRES</span>
                            <div className="expiration">
                                <span className="exp-month">{expMonth}/</span>
                                <span className="exp-year">{expYear}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form className="bg-white rounded-lg shadow-md p-8 w-130 pt-48">

                <div className="inputBox mb-8">
                    <span className="block text-gray-400">CARD NUMBER</span>
                    <input type="text" maxLength={16} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white" onChange={handleCardNumberChange} />
                </div>
                <div className="inputBox mb-8">
                    <span className="block text-gray-400">CARD HOLDER</span>
                    <input type="text" className="card-holder-input w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white" onChange={handleCardHolderChange} />
                </div>
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="inputBox flex-1">
                        <span className="block text-gray-400">EXPIRATION MM</span>
                        <select name="" id="" className="month-input w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white" onChange={handleExpMonthChange}>
                            <option value="month" disabled selected>MONTH</option>
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                    <div className="inputBox flex-1">
                        <span className="block text-gray-400">EXPIRATION YY</span>
                        <select name="" id="" className="year-input w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white" onChange={handleExpYearChange}>
                            <option value="year" disabled selected>YEAR</option>
                            <option value="24">2024</option>
                            <option value="25">2025</option>
                            <option value="26">2026</option>
                            <option value="27">2027</option>
                            <option value="28">2028</option>
                            <option value="29">2029</option>
                            <option value="30">2030</option>
                            <option value="31">2031</option>
                            <option value="32">2032</option>
                            <option value="33">2033</option>
                        </select>
                    </div>
                    <div className="inputBox flex-1">
                        <span className="block text-gray-400">CVV</span>
                        <input type="text" maxLength={4} className="cvv-input w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white" onChange={handleCvvChange} onMouseEnter={handleCvvHover} onMouseLeave={handleCvvLeave} />
                    </div>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-300 text-white border border-cyan-600 font-semibold mr-8 py-2 px-2 m-2 round z-30 hover:bg-cyan-600 hover:border-transparent hover:opacity-80 hover:tracking-wider transition-colors">Submit</button>
            </form>
        </div>
    );
}
