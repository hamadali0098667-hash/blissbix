import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Fashion" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Discover Your Style</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Explore the latest trends in fashion and upgrade your wardrobe with our premium collections.</p>
          <Link to="/shop" className="bg-white text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="relative h-64 sm:h-96 group overflow-hidden bg-gray-100 rounded-2xl shadow-sm">
            <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Men" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 group-hover:bg-black/40 transition duration-300">
              <Link to="/shop?gender=Men" className="bg-white/95 backdrop-blur-sm px-8 py-3 font-bold text-black uppercase tracking-widest text-sm rounded-full shadow-lg group-hover:bg-black group-hover:text-white group-hover:scale-105 transition duration-300">
                MEN
              </Link>
            </div>
          </div>

          <div className="relative h-64 sm:h-96 group overflow-hidden bg-gray-100 rounded-2xl shadow-sm">
            <img src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Women" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 group-hover:bg-black/40 transition duration-300">
              <Link to="/shop?gender=Women" className="bg-white/95 backdrop-blur-sm px-8 py-3 font-bold text-black uppercase tracking-widest text-sm rounded-full shadow-lg group-hover:bg-black group-hover:text-white group-hover:scale-105 transition duration-300">
                WOMEN
              </Link>
            </div>
          </div>

          <div className="relative h-64 sm:h-96 group overflow-hidden bg-gray-100 rounded-2xl shadow-sm">
            <img src="https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Accessories" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 group-hover:bg-black/40 transition duration-300">
              <Link to="/shop?gender=Accessories" className="bg-white/95 backdrop-blur-sm px-8 py-3 font-bold text-black uppercase tracking-widest text-sm rounded-full shadow-lg group-hover:bg-black group-hover:text-white group-hover:scale-105 transition duration-300">
                ACCESSORIES
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
