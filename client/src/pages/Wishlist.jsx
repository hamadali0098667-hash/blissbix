import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeProduct = async (id) => {
    await api.delete(`/wishlist/${id}`);
    fetchWishlist();
    toast.success('Removed from wishlist');
  };

  if (loading) return <div className="p-8 text-center">Loading wishlist...</div>;

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't saved any items yet. Explore our collections and find something you love!</p>
        <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.products.map(product => (
          <div key={product._id} className="border rounded p-4 relative">
            <button onClick={() => removeProduct(product._id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow z-10">X</button>
            <Link to={`/product/${product._id}`}>
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded mb-4">
                {product.images?.[0] && <img src={product.images[0]} className="object-cover w-full h-48 rounded" />}
              </div>
              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
              <p className="text-gray-500">${(product.salePrice || product.price).toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
