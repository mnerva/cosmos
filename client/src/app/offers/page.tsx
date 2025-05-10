import Link from 'next/link';

export default function Offers() {
  return (
    <div
      className="min-h-screen p-[50px] flex w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/bg.png')" }}
    >
      <div className="relative w-full h-full bg-[#191818] text-white text-center font-slab p-10">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-16 justify-items-end'>
          {/* Departure and Destination Inputs */}
          <div className='space-y-6 justify-items-end'>
            <div className="flex items-center space-x-4">
              <label className="block text-2xl mb-1" htmlFor="departure">departure:</label>
              <input id="departure" type="text" className="w-full max-w-lg bg-zinc-800 text-white px-2 py-1 border border-zinc-700 rounded focus:outline-none" />
            </div>
            <div className="flex items-center space-x-4">
              <label className="block text-2xl mb-1" htmlFor="destination">destination:</label>
              <input id="destination" type="text" className="w-full max-w-lg bg-zinc-800 text-white px-2 py-1 border border-zinc-700 rounded focus:outline-none" />
            </div>
            {/* Find Routes Button */}
            <div className="mt-6 text-center">
              <button className="bg-zinc-800 text-white px-6 py-3 border border-zinc-700 rounded hover:bg-zinc-700">
                find routes
              </button>
            </div>
          </div>
          {/* Filters and Sorting */}
          <div className="space-y-6 pt-10 justify-items-end">
            <div className='block text-xl mb-1 justify-items-end'>
              <p className="block pb-2">filter by:</p>
              <div className="flex items-center space-x-2">
                <span className="text-xl">company:</span>
                <select id="company" className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded focus:outline-none w-full">
                  <option value="">Select</option>
                  {/* Add options dynamically */}
                </select>
              </div>
            </div>

            <div className="block text-xl mb-1 justify-items-end">
              <p className="block pb-2">sort by:</p>
              <div className="flex flex-wrap gap-2">
                <button className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded">price</button>
                <button className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded">distance</button>
                <button className="bg-zinc-800 text-white px-4 py-2 border border-zinc-700 rounded">travel time</button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className='flex justify-left pt-8 text-xl'>Hot deals</p>
        </div>
      </div>
    </div>
  );
}
