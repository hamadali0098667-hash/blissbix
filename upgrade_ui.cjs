const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

// 1. Fully Responsive & Interactive Navbar
write('client/src/components/Navbar.jsx', `import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import api from '../services/api';
import { useEffect, useState } from 'react';

const DynamicCategories = ({ mobile, setMobileMenu }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.slice(0, 5))).catch(() => {});
  }, []);

  return (
    <>
      {categories.map(c => (
        <Link 
          key={c._id} 
          to={\`/shop?category=\${c.name}\`} 
          onClick={() => mobile && setMobileMenu(false)}
          className={mobile ? "block px-4 py-3 text-lg font-medium text-gray-800 border-b" : "text-sm font-semibold text-gray-600 hover:text-black uppercase tracking-wider transition-colors"}
        >
          {c.name}
        </Link>
      ))}
    </>
  );
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <nav className={\`fixed w-full top-0 z-50 transition-all duration-300 \${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white py-4'}\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 mr-2 text-gray-600 hover:text-black">
                <Menu className="w-7 h-7" />
              </button>
              <Link to="/" className="text-3xl font-extrabold tracking-tighter text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
                BLISSBIX.
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-black uppercase tracking-wider transition-colors">Home</Link>
              <Link to="/shop" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider transition-colors">Shop All</Link>
              <DynamicCategories mobile={false} />
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-5">
              <button className="text-gray-600 hover:text-black transition-transform hover:scale-110"><Search className="w-6 h-6" /></button>
              <Link to="/wishlist" className="hidden sm:block text-gray-600 hover:text-red-500 transition-transform hover:scale-110"><Heart className="w-6 h-6" /></Link>
              <Link to="/cart" className="text-gray-600 hover:text-black relative transition-transform hover:scale-110">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse-slow">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="group relative hidden sm:block">
                  <button className="text-gray-600 hover:text-black flex items-center bg-gray-100 p-2 rounded-full transition-transform hover:scale-105">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 w-56 bg-white border border-gray-100 mt-3 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    </div>
                    <div className="p-2">
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">Dashboard</Link>
                      )}
                      <Link to="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">My Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block text-sm font-bold text-white bg-black hover:bg-gray-800 px-5 py-2 rounded-full shadow-md transition-transform hover:-translate-y-0.5">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={\`fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity duration-300 lg:hidden \${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}\`} onClick={() => setIsMobileMenuOpen(false)}></div>
      
      {/* Mobile Sidebar */}
      <div className={\`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col \${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
        <div className="p-5 flex justify-between items-center border-b">
          <span className="text-2xl font-extrabold tracking-tighter text-gray-900">BLISSBIX.</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:text-black hover:bg-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto py-4">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-gray-800 border-b hover:bg-gray-50">Home</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-bold text-indigo-600 border-b hover:bg-gray-50">Shop All</Link>
          <div className="px-6 py-3 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</div>
          <div className="px-2"><DynamicCategories mobile={true} setMobileMenu={setIsMobileMenuOpen} /></div>
          
          <div className="px-6 py-3 mt-4 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">My Account</div>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-gray-800 border-b hover:bg-gray-50 flex justify-between"><User className="w-5 h-5"/> Profile</Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-gray-800 border-b hover:bg-gray-50 flex justify-between"><ShoppingBag className="w-5 h-5"/> My Orders</Link>
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-gray-800 border-b hover:bg-gray-50 flex justify-between"><Heart className="w-5 h-5"/> Wishlist</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-indigo-600 border-b hover:bg-indigo-50">Admin Dashboard</Link>}
              <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-lg font-medium text-red-600 hover:bg-red-50 flex justify-between">Logout <LogOut className="w-5 h-5"/></button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block mx-6 mt-4 text-center py-3 bg-black text-white rounded-xl font-bold text-lg shadow-lg">Login / Register</Link>
          )}
        </div>
      </div>
    </>
  );
}
`);

// 2. Add Animations and Base Styles to index.css
const cssPath = 'client/src/index.css';
let cssCode = fs.readFileSync(cssPath, 'utf8');

const newStyles = \`
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
html { scroll-behavior: smooth; }
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
\`;
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
html { scroll-behavior: smooth; }
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
\`;
if (!cssCode.includes('.animate-fade-in')) {
  fs.writeFileSync(cssPath, cssCode + newStyles);
}

// 3. Update ProductDetails to be hyper responsive
write('client/src/pages/ProductDetails.jsx', `import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';
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

  useEffect(() => {
    api.get(\`/products/\${id}\`).then(res => setProduct(res.data)).catch(() => toast.error('Product not found'));
    window.scrollTo(0,0);
  }, [id]);

  if (!product) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
    </div>
  );

  const availableSizes = [...new Set(product.variants.map(v => v.size))];
  const availableColors = [...new Set(product.variants.filter(v => selectedSize ? v.size === selectedSize : true).map(v => v.color))];
  const currentVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  const maxStock = currentVariant ? currentVariant.stock : 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return toast.error('Please select size and color');
    addToCart(product._id, quantity, selectedSize, selectedColor);
    toast.success('Added to bag!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in mt-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={()=>navigate('/')} className="hover:text-black">Home</button>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <button onClick={()=>navigate('/shop')} className="hover:text-black">Shop</button>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Gallery - Responsive */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden shadow-lg sticky top-24">
            {product.images?.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2 text-indigo-600 text-sm font-bold uppercase tracking-wider">
            <span>{product.gender}</span>
            <span>•</span>
            <span>{product.category?.name || 'Collection'}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <p className="text-3xl font-black text-gray-900">\$\{(product.salePrice || product.price).toFixed(2)}</p>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-bold ml-1">4.8</span>
              <span className="text-sm text-gray-500 ml-1">(124)</span>
            </div>
          </div>

          <p className="text-gray-600 text-base leading-relaxed mb-8">{product.description || 'Experience premium quality and style with this exclusive piece. Designed for comfort and durability.'}</p>

          {/* Selections */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Select Size</h3>
                <button className="text-sm text-indigo-600 hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {availableSizes.map(size => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSelectedColor(''); }}
                    className={\`py-3 text-sm font-bold rounded-xl transition-all duration-200 \${selectedSize === size ? 'bg-black text-white shadow-md scale-105' : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-black'}\`}
                  >{size}</button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {availableColors.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)}
                    className={\`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-200 \${selectedColor === color ? 'bg-black text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-black'}\`}
                  >{color}</button>
                ))}
                {availableColors.length === 0 && <span className="text-sm text-gray-500 italic mt-2">Select a size first</span>}
              </div>
            </div>

            {currentVariant && (
              <div className={\`text-sm font-semibold flex items-center \${maxStock > 0 ? 'text-green-600' : 'text-red-500'}\`}>
                <span className={\`w-2 h-2 rounded-full mr-2 \${maxStock > 0 ? 'bg-green-500' : 'bg-red-500'}\`}></span>
                {maxStock > 0 ? \`\${maxStock} items in stock - Ready to ship\` : 'Out of stock'}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button onClick={handleAddToCart} disabled={cartLoading || !currentVariant || maxStock === 0}
              className="flex-1 bg-black text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartLoading ? 'Processing...' : 'Add to Bag'}
            </button>
            <button onClick={async () => {
                try {
                  await api.post('/wishlist', { productId: product._id });
                  toast.success('Saved to wishlist!');
                } catch(err) { toast.error('Already in wishlist'); }
              }}
              className="w-full sm:w-auto px-6 py-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Truck className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-500">Orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500">100% Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);
`);
