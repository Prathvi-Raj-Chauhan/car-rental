import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import CarCard from '../components/CarCard';

const CAROUSEL_INTERVAL = 4500;
const CAROUSEL_SIZE = 4;

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    api.cars.getAll().then((res) => setFeaturedCars(res.data || []));
  }, []);

  useEffect(() => {
    if (featuredCars.length <= CAROUSEL_SIZE) return;
    const id = setInterval(() => {
      setCarouselIndex((i) => (i + CAROUSEL_SIZE) % featuredCars.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(id);
  }, [featuredCars.length]);

  const carouselSlice = featuredCars.length
    ? featuredCars.slice(carouselIndex, carouselIndex + CAROUSEL_SIZE).concat(
        featuredCars.slice(0, Math.max(0, carouselIndex + CAROUSEL_SIZE - featuredCars.length))
      ).slice(0, CAROUSEL_SIZE)
    : [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-jet-black to-dusk-blue text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Rent Your Perfect Car</h1>
          <p className="text-powder-blue/90 text-lg max-w-xl mx-auto mb-10">Choose from our fleet and hit the road with confidence. Simple booking, fair prices.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/book-cab" className="inline-flex items-center bg-burnt-peach text-white px-6 py-3 rounded-lg font-medium hover:bg-burnt-peach/90 transition shadow-lg">
              Book a cab
            </Link>
            <Link to="/cars" className="inline-flex items-center bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition">
              Browse Cars
            </Link>
            <Link to="/categories" className="inline-flex items-center bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition">
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured cars carousel */}
      {featuredCars.length > 0 && (
        <section className="bg-page py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-jet-black">Featured vehicles</h2>
              <Link to="/cars" className="text-dusk-blue font-medium hover:text-burnt-peach transition text-sm">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 carousel-fade" key={carouselIndex}>
              {carouselSlice.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
            {featuredCars.length > CAROUSEL_SIZE && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(featuredCars.length / CAROUSEL_SIZE) }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setCarouselIndex(i * CAROUSEL_SIZE)}
                    className={`w-2 h-2 rounded-full transition-colors ${carouselIndex === i * CAROUSEL_SIZE ? 'bg-burnt-peach' : 'bg-powder-blue/50 hover:bg-powder-blue'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-semibold text-jet-black mb-8 text-center">Why choose us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-card border border-slate-200/80 text-center">
            <div className="w-12 h-12 rounded-full bg-powder-blue/20 flex items-center justify-center mx-auto mb-4 text-dusk-blue">◆</div>
            <h3 className="text-dusk-blue font-semibold text-lg mb-2">Wide selection</h3>
            <p className="text-slate-600 text-sm">From economy to luxury, find the right vehicle for your trip.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card border border-slate-200/80 text-center">
            <div className="w-12 h-12 rounded-full bg-powder-blue/20 flex items-center justify-center mx-auto mb-4 text-dusk-blue">◆</div>
            <h3 className="text-dusk-blue font-semibold text-lg mb-2">Best prices</h3>
            <p className="text-slate-600 text-sm">Competitive daily rates with no hidden fees.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card border border-slate-200/80 text-center">
            <div className="w-12 h-12 rounded-full bg-powder-blue/20 flex items-center justify-center mx-auto mb-4 text-dusk-blue">◆</div>
            <h3 className="text-dusk-blue font-semibold text-lg mb-2">Easy booking</h3>
            <p className="text-slate-600 text-sm">Book online in minutes and pick up when you're ready.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
