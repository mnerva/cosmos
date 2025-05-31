'use client';

import { useState, useEffect } from 'react';
import { fetchOffers } from '../utils/api';
import { useMemo } from 'react';

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
  const [companyLegs, setCompanyLegs] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('');
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');


  // Fetch data on initial load
  useEffect(() => {
    const getData = async () => {
      const data = await fetchOffers()

      const legsData = Array.isArray(data?.legs) ? data.legs : [];
      setLegs(legsData)
    }
    getData()
  }, [])

  // Extract unique company names for the dropdown filter
  // Used for the company filter dropdown
  const companyNames = Array.from(
    new Set(legs.flatMap((leg) => leg.providers.map((p) => p.company.name)))
  )

  const activeLegs = useMemo(() => {
    return companyLegs.length > 0 ? companyLegs : filteredLegs;
  }, [companyLegs, filteredLegs]);

  // Handle filtering
  const handleRouteFilter = () => {
    const departure = document.getElementById("departure").value;
    const destination = document.getElementById("destination").value;
    
    let filtered = legs.filter((leg) => {
      let filteredProviders = leg.providers;
      const matchesDeparture =
        !departure || leg.routeInfo.from.name.toLowerCase().includes(departure.toLowerCase());

      const matchesDestination =
        !destination || leg.routeInfo.to.name.toLowerCase().includes(destination.toLowerCase());
      
      // Only return legs that match and have at least one provider
      if (matchesDeparture && matchesDestination) {
        return { ...leg };
      }
      return null;
    }).filter(Boolean); // Remove nulls
    setFilteredLegs(filtered);
  }

  const handleCompanyFilter = () => {
    const company = document.getElementById("company").value;

    // Filter logic
    let filtered = filteredLegs.map((leg) => {
      let filteredProviders = leg.providers;
      if (company) {
        filteredProviders = leg.providers.filter(
          (p) => p.company.name.trim().toLowerCase() === company.trim().toLowerCase()
        );
      }
      // Only return legs that match and have at least one provider
      if (filteredProviders.length > 0) {
        return { ...leg, providers: filteredProviders };
      }
      return null;
    }).filter(Boolean); // Remove nulls
    setCompanyLegs(filtered);

    if (company && filtered.length === 0) {
      setCompanyLegs([]);
      setNoResultsMessage("No flights from the selected company. Here are some other options:");
    } else {
      setNoResultsMessage(""); // Clear message if results found or no filter
    }
  }

  const handleSort = (criteria) => {
    let newOrder = 'asc';
    
    if (criteria === sortCriteria) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }

    setSortCriteria(criteria);
    setSortOrder(newOrder);

    const legsToSort = companyLegs.length > 0 ? companyLegs : filteredLegs;

    const sortedLegs = legsToSort.map(leg => {
      const sortedProviders = [...leg.providers].sort((a, b) => {
        let comparison = 0;

        if (criteria === 'price') {
          comparison = a.price - b.price;
        } else if (criteria === 'time') {
          const durationA = new Date(a.flightEnd) - new Date(a.flightStart);
          const durationB = new Date(b.flightEnd) - new Date(b.flightStart);
          comparison = durationA - durationB;
        }

        // Reverse if order is descending
        return newOrder === 'asc' ? comparison : -comparison;
      });

      return {
        ...leg,
        providers: sortedProviders,
      };
    });

      // Apply result to the appropriate array
      if (companyLegs.length > 0) {
        setCompanyLegs(sortedLegs);
      } else {
        setFilteredLegs(sortedLegs);
      }
  }

  function formatDuration(start, end) {
    const durationMs = new Date(end) - new Date(start);
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

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
                onClick={handleRouteFilter}
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
                <select id="company" onChange={handleCompanyFilter} className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded focus:outline-none w-full">
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
                <button onClick={() => handleSort('time')} className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded">travel time</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className='flex justify-left pt-8 text-2xl'>Hot deals</p>

          {noResultsMessage && (
            <p className="text-xl">{noResultsMessage}</p>
          )}

          {activeLegs.length > 0 ? (
            <div className="space-y-6">
              {activeLegs.map((leg) => (
                <div key={leg.id} className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold">
                      {leg?.routeInfo?.from?.name?.toLowerCase() ?? 'unknown'} - {leg?.routeInfo?.to?.name?.toLowerCase() ?? 'unknown'}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {Array.isArray(leg?.providers) &&
                      leg.providers.map((provider, index) => (
                        <div
                          key={`${leg.id}-${provider.id}`}
                          className="bg-zinc-800 text-white p-4 rounded-md border border-white flex items-center justify-between"
                        >
                          <p className="capitalize">{provider?.company?.name?.toLowerCase() ?? 'unknown'}</p>
                          <p>{formatDuration(provider?.flightStart, provider?.flightEnd)}</p>
                          <p>${provider?.price?.toFixed(2) ?? '0.00'}</p>
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