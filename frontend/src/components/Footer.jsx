import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-jet-black text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/" className="font-semibold text-powder-blue hover:text-light-cyan transition">Car Rental</Link>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="hover:text-burnt-peach transition">Home</Link>
            <Link to="/cars" className="hover:text-burnt-peach transition">Cars</Link>
            <Link to="/categories" className="hover:text-burnt-peach transition">Categories</Link>
          </div>
        </div>
        <p className="text-center sm:text-right text-slate-500 text-sm mt-6">© {new Date().getFullYear()} Car Rental</p>
      </div>
    </footer>
  );
}
