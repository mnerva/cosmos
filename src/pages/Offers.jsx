'use client';

import { useState, useEffect } from 'react';
import { fetchOffers } from '../utils/api';

// Function to format duration from a date string
function formatDate(dateString) {
  const date = new Date(dateString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return `${hours}h ${minutes}min`;
}

// Main Offers page component
export default function Offers() {
  const [legs, setLegs] = useState([])
  const [filteredLegs, setFilteredLegs] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('');

  // Fetch data on initial load
  useEffect(() => {
    const getData = async () => {
      const data = await fetchOffers()

      const legsData = Array.isArray(data?.legs) ? data.legs : [];
      setLegs(legsData)
      setFilteredLegs(legsData)
    }
    getData()
  }, [])

  // Extract unique company names for the dropdown filter
  const companyNames = Array.from(
    new Set(legs.flatMap((leg) => leg.providers.map((p) => p.company.name)))
  )

  // Handles filtering and sorting the legs
  const handleFilterAndSort = () => {
    const departure = document.getElementById("departure").value;
    const destination = document.getElementById("destination").value;
    const company = document.getElementById("company").value;

    console.log('departure:', departure, 'destination:', destination, 'company:', company);

    // Filter logic
    let filtered = legs.filter((leg) => {
      const providerCompanies = leg.providers.map((p) => p.company.name.trim().toLowerCase());
      console.log('Provider companies for this leg:', providerCompanies);

      const matchesCompany =
        !company || providerCompanies.includes(company.trim().toLowerCase());

      const matchesDeparture =
        !departure || leg.routeInfo.from.name.toLowerCase().includes(departure.toLowerCase());

      const matchesDestination =
        !destination || leg.routeInfo.to.name.toLowerCase().includes(destination.toLowerCase());

      console.log('matchesDeparture:', matchesDeparture);
      console.log('matchesDestination:', matchesDestination);

      return matchesDeparture && matchesDestination && matchesCompany;
    });

    // Sort the filtered legs
    if (sortCriteria === 'price') {
      filtered.sort((a, b) => a.providers[0].price - b.providers[0].price);
    } else if (sortCriteria === 'distance') {
      filtered.sort((a, b) => a.routeInfo.distance - b.routeInfo.distance);
    } else if (sortCriteria === 'time') {
      filtered.sort((a, b) => {
        const timeA = new Date(a.providers[0].flightEnd).getTime() - new Date(a.providers[0].flightStart).getTime();
        const timeB = new Date(b.providers[0].flightEnd).getTime() - new Date(b.providers[0].flightStart).getTime();
        console.log('timeA:', timeA, 'timeB:', timeB);
        return timeA - timeB;
      });
    }

    console.log('filtered:', filtered);
    setFilteredLegs(filtered); // Update what is displayed
    console.log('filteredLegs:', filteredLegs);
  };

  // Set sort criteria and trigger filtering/sorting
  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    console.log('sortCriteria:', criteria);
    handleFilterAndSort();
  };
  return (
    <div
      className="min-h-screen p-10 w-full bg-cover bg-center bg-no-repeat overflow-y-auto"
      style={{ backgroundImage: "url('/assets/images/bg.png')" }}
    >
      <div className="relative p-10 w-full h-auto bg-[#191818] text-white text-center font-slab">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-16 justify-items-end'>
          <div className='space-y-6 justify-items-end'>
            <div className="flex items-center space-x-4">
              <label className="block text-2xl mb-1" htmlFor="departure">departure:</label>
              <input id="departure" type="text" className="w-full max-w-lg bg-zinc-800 text-white px-2 py-1 border border-zinc-700 rounded focus:outline-none" />
            </div>
            <div className="flex items-center space-x-4">
              <label className="block text-2xl mb-1" htmlFor="destination">destination:</label>
              <input id="destination" type="text" className="w-full max-w-lg bg-zinc-800 text-white px-2 py-1 border border-zinc-700 rounded focus:outline-none" />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleFilterAndSort}
                className="bg-zinc-800 text-white px-6 py-3 border border-zinc-700 rounded hover:bg-zinc-700">
                find routes
              </button>
            </div>
          </div>

          <div className="space-y-6 pt-10 justify-items-end">
            <div className='block text-xl mb-1 justify-items-end'>
              <p className="block pb-2">filter by:</p>
              <div className="flex items-center space-x-2">
                <span className="text-xl">company:</span>
                <select id="company" onChange={handleFilterAndSort} className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded focus:outline-none w-full">
                  <option value="">Select</option>
                  {companyNames.map((company) => (
                    <option key={company} value={company.trim()}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="block text-xl mb-1 justify-items-end">
              <p className="block pb-2">sort by:</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleSort('price')} className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded">price</button>
                <button onClick={() => handleSort('distance')} className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded">distance</button>
                <button onClick={() => handleSort('time')} className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded">travel time</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className='flex justify-left pt-8 text-2xl'>Hot deals</p>
          {filteredLegs.length > 0 ? (
            <div className="space-y-6">
              {filteredLegs.map((leg) => (
                <div key={leg.id} className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold">
                      {leg.routeInfo.from.name.toLowerCase()} - {leg.routeInfo.to.name.toLowerCase()}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {leg.providers.map((provider) => (
                      <div
                        key={provider.id}
                        className="bg-zinc-800 text-white p-4 rounded-md border border-white flex items-center justify-between"
                      >
                        <p className="capitalize">{provider.company.name.toLowerCase()}</p>
                        <p>{formatDate(provider.flightStart)}</p>
                        <p>${provider.price.toFixed(2)}</p>
                        <button className="border border-white px-4 py-1 rounded hover:bg-white hover:text-black">
                          select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl">No flights available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
