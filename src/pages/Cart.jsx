import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

export default function Cart() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  if (cart.length === 0)
    return (
      <div className="min-h-screen p-[100px] flex w-full items-center justify-center bg-cover bg-center bg-no-repeat font-josefin">
        <div className="bg-[#191818] text-red w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-20 text-center font-slab">
          <h1 className="text-2xl mb-2">your cart is empty.</h1>
          <button onClick={() => navigate("/offers")} 
            className="hover:underline">⇦ back to offers</button>
        </div>
      </div>
    );
  
  // total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price ?? 0), 0);

  // total travel time in minutes
  const totalMinutes = cart.reduce((sum, item) => {
    const start = new Date(item.flightStart);
    const end = new Date(item.flightEnd);
    return sum + (end.getTime() - start.getTime()) / 60000; // convert ms to minutes
  }, 0);

  // format duration
  const formatTotalTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}h ${m}min`;
  };


  function formatDuration(start, end) {
    const durationMs = new Date(end) - new Date(start);
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  const handlePurchase = async (e) => {
    e?.preventDefault?.();

    if (!firstName || !lastName) {
      alert("Please fill in your first and last name.");
      return;
    }

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          reservations: cart.map((item) => ({
            offerId: item.id,
            companyName: item.company?.name ?? "",
            from: item.routeInfo?.from?.name ?? "",
            to: item.routeInfo?.to?.name ?? "",
            flightStart: item.flightStart,
            flightEnd: item.flightEnd,
            price: item.price,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to make reservation");

      const data = await response.json();
      const reservationCode = data.code;

      clearCart();  // Clear all items
      navigate("/confirmation", { state: { reservationCode } });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };


  return (
    <div
      className="min-h-screen p-10 w-full bg-cover bg-center bg-no-repeat overflow-y-auto"
      style={{ backgroundImage: "url('/assets/images/bg.png')" }}
    >
      <div className="relative p-10 w-full h-auto bg-[#191818] text-white text-center font-slab">
        {/* Top section: Inputs and Cart Summary side-by-side */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 gap-x-30'>
          {/* Name Inputs */}
          <div className='space-y-6 justify-items-end max-w-4xl'>
            <div className="flex items-center space-x-4">
              <label className="flex-none text-2xl mb-1" htmlFor="firstName">first name:</label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="flex-grow max-w-lg text-white px-2 py-1 border border-zinc-400 rounded focus:outline-none" />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex-none text-2xl mb-1" htmlFor="lastName">last name:</label>
              <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}className="flex-grow max-w-lg text-white px-2 py-1 border border-zinc-400 rounded focus:outline-none" />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handlePurchase}
                className="text-white px-6 py-3 border border-zinc-400 rounded hover:bg-zinc-500">
                purchase
              </button>
            </div>
          </div>
          {/* Cart Summary */}
          <div className="space-y-6 pt-1 max-w-4xl">
            <div className="text-xl space-y-2 border border-zinc-600 rounded-md p-4">
              <p className="text-2xl pb-2">cart summary</p>
              <div className="flex justify-between">
                <span>Total quoted price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total quoted travel time:</span>
                <span>{formatTotalTime(totalMinutes)}</span>
              </div>
            </div>
          </div>
          {/* Bottom section: Your Selected Deals */}
          <div className="col-span-1 lg:col-span-2 space-y-3">
            <p className='flex justify-left pt-8 text-2xl'>Your Selected Deals</p>
            {cart.map((item) => (
            <div key={item.id} className="space-y-4 w-full">
              <p className="text-lg font-semibold">
                {item.routeInfo?.from?.name?.toLowerCase() ?? 'unknown'} - {item.routeInfo?.to?.name?.toLowerCase() ?? 'unknown'}
              </p>
              <div className="bg-zinc-800 text-white p-4 rounded-md border border-white flex items-center justify-between">
                <p>{item.company.name}</p>
                <p>{formatDuration(item.flightStart, item.flightEnd)}</p>
                <p>${item.price}</p>
                <button onClick={() => clearCart(item.id)} className="bg-zinc-700 p-0.5 px-3 border rounded-md">Remove</button>
              </div>
            </div>
          ))}
            <button onClick={() => navigate("/offers", {state: { reservationCode: "sd"}})} className="flex justify-left p-0.5 px-3 mt-5 border rounded-md hover:bg-zinc-700">Back to Deals</button>
          </div>
        </div>
      </div>
    </div>
  );
}
