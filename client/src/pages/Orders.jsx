import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(err => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't placed any orders. Start browsing our collections to find your perfect fit.</p>
        <Link to="/shop" className="bg-black text-white px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
        <p className="text-gray-500 mt-2">Check the status of recent orders and view details.</p>
      </div>
      
      <div className="space-y-8">
        {orders.map(order => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Date Placed</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusBadge(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <span className="text-sm font-medium text-gray-400">#{order._id.substring(18).toUpperCase()}</span>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider border-b pb-2">Items in this order</h4>
              <div className="space-y-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-lg p-3 mr-4">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name || 'Product Item'}</p>
                        <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
