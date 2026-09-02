import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { Heart, ChevronRight, Star, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading: cartLoading } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data)).catch(() => toast.error('Product not found'));
    window.scrollTo(0,0);
  }, [id]);

  if (!product) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
    </div>
  );

  const availableSizes = [...new Set(product.variants.map(v => v.size))];
  const availableColors = [...new Set(product.variants.map(v => v.color))];
  const currentVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  const maxStock = currentVariant ? currentVariant.stock : 0;

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    if (!selectedSize || !selectedColor) return toast.error('Please select size and color');
    try {
      await addToCart(product._id, selectedSize, selectedColor, quantity, product.salePrice || product.price);
      toast.success('Added to bag!');
    } catch(err) {
      toast.error('Failed to add to bag');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={()=>navigate('/')} className="hover:text-black transition-colors">Home</button>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <button onClick={()=>navigate('/shop')} className="hover:text-black transition-colors">Shop</button>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <span className="text-gray-900 font-bold truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Image Gallery - Responsive */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden shadow-2xl lg:sticky lg:top-28 relative group">
            {product.images?.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
              New Arrival
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-4 lg:py-10">
          <div className="mb-3 flex items-center gap-3 text-indigo-600 text-sm font-bold uppercase tracking-widest">
            <span className="bg-indigo-50 px-3 py-1 rounded-full">{product.gender}</span>
            <span className="text-gray-300">•</span>
            <span>{product.category?.name || 'Collection'}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">{product.name}</h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <p className="text-4xl font-black text-gray-900">${(product.salePrice || product.price).toFixed(2)}</p>
            <div className="flex items-center bg-gray-900 text-white px-4 py-1.5 rounded-full shadow-md">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-bold ml-1.5 tracking-wide">4.8</span>
              <span className="text-sm text-gray-300 ml-1.5 font-medium">(124 Reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-10">{product.description || 'Experience premium quality and style with this exclusive piece. Designed for comfort, durability, and a perfect fit for any occasion.'}</p>

          {/* Selections */}
          <div className="bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-100 mb-10 shadow-inner">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center"><span className="w-1.5 h-6 bg-indigo-600 rounded-full mr-3"></span>Select Size</h3>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                {availableSizes.map(size => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSelectedColor(''); }}
                    className={`py-3 sm:py-4 text-sm font-bold rounded-2xl transition-all duration-300 ${selectedSize === size ? 'bg-gray-900 text-white shadow-xl scale-105 ring-2 ring-offset-2 ring-gray-900' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900'}`}
                  >{size}</button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center"><span className="w-1.5 h-6 bg-indigo-600 rounded-full mr-3"></span>Select Color</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {availableColors.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)}
                    className={`px-6 sm:px-8 py-3 sm:py-4 text-sm font-bold rounded-2xl transition-all duration-300 ${selectedColor === color ? 'bg-gray-900 text-white shadow-xl scale-105 ring-2 ring-offset-2 ring-gray-900' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900'}`}
                  >{color}</button>
                ))}
              </div>
            </div>

            {currentVariant && (
              <div className={`mt-6 text-sm font-bold flex items-center p-4 rounded-xl ${maxStock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <span className={`w-2.5 h-2.5 rounded-full mr-3 animate-pulse ${maxStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {maxStock > 0 ? `${maxStock} items in stock — Ready to dispatch` : 'Currently out of stock'}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button onClick={handleAddToCart} disabled={cartLoading || !currentVariant || maxStock === 0}
              className="flex-1 bg-gray-900 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:bg-black hover:shadow-2xl hover:-translate-y-1 focus:ring-4 focus:ring-gray-300 disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartLoading ? 'Processing...' : 'Add to Bag'}
            </button>
            <button onClick={async () => {
                try {
                  await api.post('/wishlist', { productId: product._id });
                  toast.success('Saved to wishlist!');
                } catch(err) { toast.error('Already in wishlist'); }
              }}
              className="w-full sm:w-20 h-16 sm:h-auto bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
            >
              <Heart className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 pt-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-900"><Truck className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-extrabold text-gray-900">Free Express Delivery</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-900"><ShieldCheck className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-extrabold text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">256-bit SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
