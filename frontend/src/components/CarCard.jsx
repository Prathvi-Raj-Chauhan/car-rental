import { Link } from 'react-router-dom';

const API_BASE = '';

function CarPlaceholder() {
  return (
    <div className="w-full h-full min-h-[180px] bg-gradient-to-br from-dusk-blue/20 to-powder-blue/30 flex items-center justify-center">
      <svg className="w-16 h-16 text-dusk-blue/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-8 4h8m-3-8v16m-4 0V7m4 0v10" />
      </svg>
    </div>
  );
}

export default function CarCard({ car, className = '' }) {
  return (
    <Link
      to={'/cars/' + car._id}
      className={`block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200/80 hover:border-powder-blue/50 group ${className}`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        {car.image ? (
          <img
            src={API_BASE + car.image}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <CarPlaceholder />
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-jet-black text-lg group-hover:text-dusk-blue transition-colors truncate">{car.name}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{car.brand} · {car.model} · {car.year}</p>
        {car.category?.name && (
          <span className="inline-block mt-2 text-xs font-medium text-powder-blue bg-powder-blue/10 px-2 py-0.5 rounded">{car.category.name}</span>
        )}
        <p className="mt-3 text-dusk-blue font-semibold">₹{car.pricePerDay}<span className="text-slate-500 font-normal text-sm">/day</span></p>
      </div>
    </Link>
  );
}
