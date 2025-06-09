import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const reservationCode = location.state?.reservationCode ?? "UNKNOWN";

  return (
    <div
      className="min-h-screen p-[100px] flex w-full items-center justify-center bg-cover bg-center bg-no-repeat font-josefin"
      style={{ backgroundImage: "url('/assets/images/bg.png')" }}
    >
      <div className="bg-[#191818] text-red w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-20 text-center font-slab">
        <h1 className="text-2xl mb-2">thank you for your purchase!</h1>
        <p className="text-2xl mb-2">to see your reservation info, please keep your <b>reservation code</b>.</p>
        <p className="text-2xl mb-6">
          your reservation code: <b>{reservationCode}</b>
        </p>
        <p className="text-2xl mb-6">
          we hope you have a safe trip and happy exploring!
        </p>
        <Link to="/offers">
          <button className="text-2xl flex items-center justify-center gap-2 hover:underline mx-auto">
            go back to deals
            <span className="text-2xl">→</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
