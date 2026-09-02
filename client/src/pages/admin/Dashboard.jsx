import { Link, Routes, Route, useLocation } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';

export default function Dashboard() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return 'bg-gray-800 text-white border-l-4 border-indigo-500';
    if (path !== '/admin' && location.pathname.includes(path)) return 'bg-gray-800 text-white border-l-4 border-indigo-500';
    return 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent transition-colors';
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar - Modern Dark Theme */}
      <div className="w-64 bg-gray-900 text-white shadow-xl flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 uppercase">
            Admin Panel
          </h2>
          <p className="text-xs text-gray-500 mt-1">Blissbix Management</p>
        </div>
        <ul className="mt-4 flex flex-col gap-1">
          <li>
            <Link to="/admin" className={`flex items-center px-6 py-3 font-medium ${isActive('/admin')}`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className={`flex items-center px-6 py-3 font-medium ${isActive('/products')}`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              Products
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className={`flex items-center px-6 py-3 font-medium ${isActive('/orders')}`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/categories" className={`flex items-center px-6 py-3 font-medium ${isActive('/categories')}`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              Categories
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={`flex items-center px-6 py-3 font-medium ${isActive('/users')}`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Users
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</h3>
                    <p className="text-4xl font-extrabold text-gray-800 mt-2">$0.00</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-full text-green-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </div>
                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Orders</h3>
                    <p className="text-4xl font-extrabold text-gray-800 mt-2">0</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  </div>
                </div>
                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Products</h3>
                    <p className="text-4xl font-extrabold text-gray-800 mt-2">15</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-full text-purple-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  );
}
