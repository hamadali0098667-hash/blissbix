import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, LayoutDashboard, Package, ShieldCheck } from 'lucide-react';
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
          to={`/shop?category=${c.name}`} 
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <nav className={`sticky w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white py-4'}`}>
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
              <DynamicCategories mobile={false} setMobileMenu={()=>{}} />
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-5">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-600 hover:text-black transition-transform hover:scale-110">
                {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
              </button>
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
                  <button className="flex items-center space-x-2 bg-gray-50 border border-gray-200 p-1.5 pr-3 rounded-full transition-all hover:bg-gray-100 hover:shadow-sm">
                    <div className="w-7 h-7 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 w-64 bg-white border border-gray-100 mt-2 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white rounded-t-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-bold text-lg shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <div className="mt-3 flex items-center inline-flex bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Admin Account
                        </div>
                      )}
                    </div>
                    <div className="p-2 space-y-1">
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors">
                          <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
                        </Link>
                      )}
                      <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-colors">
                        <User className="w-4 h-4 mr-3" /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-colors">
                        <Package className="w-4 h-4 mr-3" /> My Orders
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-4 h-4 mr-3" /> Logout
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

        {/* Search Bar Dropdown */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t mt-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, categories..." 
                className="w-full bg-gray-100 border-none rounded-full py-3 px-6 pl-12 text-gray-900 focus:ring-2 focus:ring-black outline-none font-medium text-sm"
                autoFocus={isSearchOpen}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      
      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-gray-800 border-b hover:bg-gray-50 flex items-center justify-between"><User className="w-5 h-5"/> Profile</Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-gray-800 border-b hover:bg-gray-50 flex items-center justify-between"><ShoppingBag className="w-5 h-5"/> My Orders</Link>
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-gray-800 border-b hover:bg-gray-50 flex items-center justify-between"><Heart className="w-5 h-5"/> Wishlist</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-lg font-medium text-indigo-600 border-b hover:bg-indigo-50">Admin Dashboard</Link>}
              <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-lg font-medium text-red-600 hover:bg-red-50 flex items-center justify-between">Logout <LogOut className="w-5 h-5"/></button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block mx-6 mt-4 text-center py-3 bg-black text-white rounded-xl font-bold text-lg shadow-lg">Login / Register</Link>
          )}
        </div>
      </div>
    </>
  );
}
