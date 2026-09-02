import { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import useProductStore from '../store/productStore';

export default function Shop() {
  const { products, fetchProducts, loading } = useProductStore();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts(location.search);
  }, [location.search]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {searchParams.get('keyword') ? `Search Results: "${searchParams.get('keyword')}"` : searchParams.get('category') || searchParams.get('gender') || 'All Collection'}
          </h1>
          <p className="text-gray-500 mt-2">Discover our latest arrivals and premium styles.</p>
        </div>
        <p className="text-sm font-medium text-gray-500 hidden md:block">Showing {products.length} products</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm border-b pb-3">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className={`flex items-center text-sm ${!searchParams.get('category') && !searchParams.get('gender') ? "font-bold text-indigo-600" : "text-gray-600 hover:text-indigo-500 transition-colors"}`}>
                  <span className="w-2 h-2 rounded-full mr-3 bg-current opacity-70"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Men" className={`flex items-center text-sm ${searchParams.get('gender') === 'Men' ? "font-bold text-indigo-600" : "text-gray-600 hover:text-indigo-500 transition-colors"}`}>
                  <span className="w-2 h-2 rounded-full mr-3 bg-current opacity-70"></span>
                  Men's Wear
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Women" className={`flex items-center text-sm ${searchParams.get('gender') === 'Women' ? "font-bold text-indigo-600" : "text-gray-600 hover:text-indigo-500 transition-colors"}`}>
                  <span className="w-2 h-2 rounded-full mr-3 bg-current opacity-70"></span>
                  Women's Wear
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Accessories" className={`flex items-center text-sm ${searchParams.get('gender') === 'Accessories' ? "font-bold text-indigo-600" : "text-gray-600 hover:text-indigo-500 transition-colors"}`}>
                  <span className="w-2 h-2 rounded-full mr-3 bg-current opacity-70"></span>
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Kids" className={`flex items-center text-sm ${searchParams.get('gender') === 'Kids' ? "font-bold text-indigo-600" : "text-gray-600 hover:text-indigo-500 transition-colors"}`}>
                  <span className="w-2 h-2 rounded-full mr-3 bg-current opacity-70"></span>
                  Kids Collection
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
          {products.map(product => (
            <div key={product._id} className="group relative flex flex-col">
              <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-xl">
                {product.images?.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-center transform transition duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                )}
                
                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Link to={`/product/${product._id}`} className="block w-full bg-white text-black font-semibold text-center py-3 rounded-xl shadow-lg hover:bg-black hover:text-white transition-colors">
                    Quick View
                  </Link>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    <Link to={`/product/${product._id}`}>
                      <span aria-hidden="true" className="absolute inset-0 z-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
                    {product.gender} Collection
                  </p>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-gray-900 mt-1 sm:mt-0 sm:pl-4">${(product.salePrice || product.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <p className="text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
