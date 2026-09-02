const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('src/pages/Cart.jsx', `import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function Cart() {
  const { cart, removeFromCart, loading } = useCartStore();
  const navigate = useNavigate();

  if (loading && !cart) return <div className="p-8 text-center">Loading cart...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8">
          <ul className="border-t border-b divide-y divide-gray-200">
            {cart.items.map((item) => (
              <li key={item._id} className="flex py-6">
                <div className="flex-shrink-0 w-24 h-24 border rounded-md overflow-hidden">
                   {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                   )}
                </div>
                <div className="ml-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{item.product?.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                      <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">\$\{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => removeFromCart(item._id)} className="text-sm font-medium text-red-600 hover:text-red-500">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <p>Subtotal</p>
                <p>\$\{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping estimate</p>
                <p>\$\{shipping.toFixed(2)}</p>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium">
                <p>Total</p>
                <p>\$\{total.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => {
                alert('Checkout implemented partially in demo. See requirements.');
              }}
              className="w-full mt-6 bg-black text-white px-4 py-3 rounded-md font-medium hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

write('src/pages/admin/Dashboard.jsx', `import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    // Ideally we would fetch stats, but for now just basic placeholders
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex">
      <div className="w-64 border-r pr-4 min-h-[500px]">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-2">
          <li className="font-semibold text-black bg-gray-100 p-2 rounded cursor-pointer">Dashboard</li>
          <li className="text-gray-600 p-2 hover:bg-gray-50 rounded cursor-pointer">Products</li>
          <li className="text-gray-600 p-2 hover:bg-gray-50 rounded cursor-pointer">Categories</li>
          <li className="text-gray-600 p-2 hover:bg-gray-50 rounded cursor-pointer">Orders</li>
          <li className="text-gray-600 p-2 hover:bg-gray-50 rounded cursor-pointer">Users</li>
        </ul>
      </div>
      <div className="flex-1 pl-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="p-6 bg-white border rounded shadow-sm text-center">
             <h3 className="text-gray-500 mb-2">Total Revenue</h3>
             <p className="text-3xl font-bold">$12,450</p>
           </div>
           <div className="p-6 bg-white border rounded shadow-sm text-center">
             <h3 className="text-gray-500 mb-2">Total Orders</h3>
             <p className="text-3xl font-bold">145</p>
           </div>
           <div className="p-6 bg-white border rounded shadow-sm text-center">
             <h3 className="text-gray-500 mb-2">Total Products</h3>
             <p className="text-3xl font-bold">24</p>
           </div>
           <div className="p-6 bg-white border rounded shadow-sm text-center">
             <h3 className="text-gray-500 mb-2">Total Customers</h3>
             <p className="text-3xl font-bold">89</p>
           </div>
        </div>
      </div>
    </div>
  );
}
`);

console.log('Frontend Part 4 generated');
