import { useNavigate } from "react-router-dom";
import { useState } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [reservation, setReservation] = useState(null);
  const [routes, setRoutes] = useState(null);

  const seeReservations = async (e) => {
    e?.preventDefault?.();
    
    if (!firstName || !lastName || !code ) {
      alert("Please fill in your code, first and last name.");
      return;
    }

    const params = new URLSearchParams({
      code,
      firstName,
      lastName,
    }).toString();

    try {
      const response = await fetch(`/api/reservations?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Reservation not found");
      const data = await response.json();
      setReservation(data.reservation);
      setRoutes(data.routes);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setReservation(null);
      setRoutes([]);
    }
  };


  return (
    <div
      className="min-h-screen p-10 w-full bg-cover bg-center bg-no-repeat overflow-y-auto"
      style={{ backgroundImage: "url('/assets/images/bg.png')" }}
    >
      <div className="relative p-10 w-full h-auto bg-[#191818] text-white text-center font-slab">
        {/* Top section: Inputs and Cart Summary side-by-side */}
        <div className='flex flex-col items-center gap-16'>
          {/* Name Inputs */}
          <div className='space-y-6 justify-items-end'>
            <div className="flex items-center space-x-4">
              <label className="flex-none text-2xl mb-1" htmlFor="firstName">first name:</label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="flex-grow max-w-lg text-white px-2 py-1 border border-zinc-400 rounded focus:outline-none" />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex-none text-2xl mb-1" htmlFor="lastName">last name:</label>
              <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}className="flex-grow max-w-lg text-white px-2 py-1 border border-zinc-400 rounded focus:outline-none" />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex-none text-2xl mb-1" htmlFor="code">code:</label>
              <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)}className="flex-grow max-w-lg text-white px-2 py-1 border border-zinc-400 rounded focus:outline-none" />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={seeReservations}
                className="text-white px-6 py-3 border border-zinc-400 rounded hover:bg-zinc-500">
                see reservation
              </button>
            </div>
          </div>
          {/* Bottom section: Your Selected Deals */}
          <div className="w-full space-y-3">
            <p className='pt-8 text-2xl text-center'><b>Your Reservation</b></p>
            {reservation && (
              <div className="flex justify-center w-full">
                <div className="space-y-2 w-full max-w-xl mx-auto text-center">
                  {routes && routes.length > 0 && (
                    <div className="space-y-2">
                      {routes.map((route, index) => (
                        <p key={index} className="flex items-center justify-center pt-4 text-xl">
                          <strong>Route:</strong>{'\u00A0'}{route.from_name} → {route.to_name}
                        </p>
                      ))}
                      {routes.map((route, index) => (
                        <p key={index} className="flex items-center justify-center pt-4 text-xl">
                          <strong>Company:</strong>{'\u00A0'}{route.company_name}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="flex items-center justify-center pt-4 text-xl"><strong>Name:</strong>{'\u00A0'}{reservation.first_name} {reservation.last_name}</p>
                  <p className="flex items-center justify-center pt-4 text-xl"><strong>Total Price:</strong>{'\u00A0'} ${reservation.total_price}</p>
                  <p className="flex items-center justify-center pt-4 text-xl"><strong>Total Time:</strong>{'\u00A0'}{reservation.total_time} hours</p>
                </div>
              </div>
            )}
            <button onClick={() => navigate("/offers")} className="flex justify-left p-0.5 px-3 mt-5 border rounded-md hover:bg-zinc-700">Back to Deals</button>
          </div>
        </div>
      </div>
    </div>
  );
}
