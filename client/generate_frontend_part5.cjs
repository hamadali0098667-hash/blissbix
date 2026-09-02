const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('src/pages/Checkout.jsx', `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName: '', phone: '', address: '', city: '', state: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 10;
  const total = subtotal + shipping;

  const handleChange = (e) => setAddress({...address, [e.target.name]: e.target.value});

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images?.[0] || ''
      }));

      await api.post('/orders', {
        orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: subtotal,
        shippingFee: shipping,
        total
      });

      await clearCart(); // In case backend didn't clear our local state
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
        <form onSubmit={placeOrder} className="space-y-4">
          <input required name="fullName" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 rounded" />
          <input required name="phone" placeholder="Phone" onChange={handleChange} className="w-full border p-2 rounded" />
          <input required name="address" placeholder="Address" onChange={handleChange} className="w-full border p-2 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <input required name="city" placeholder="City" onChange={handleChange} className="w-full border p-2 rounded" />
            <input required name="state" placeholder="State" onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <input required name="postalCode" placeholder="Postal Code" onChange={handleChange} className="w-full border p-2 rounded" />
          
          <h3 className="text-xl font-bold mt-8 mb-4">Payment Method</h3>
          <div className="border p-4 rounded bg-gray-50">
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" checked={paymentMethod==='COD'} onChange={()=>setPaymentMethod('COD')} />
              <span>Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center space-x-2 mt-2 opacity-50 cursor-not-allowed">
              <input type="radio" name="payment" disabled />
              <span>Credit Card (Stripe - Coming Soon)</span>
            </label>
          </div>
          
          <button disabled={loading} type="submit" className="w-full mt-6 bg-black text-white p-3 rounded font-bold hover:bg-gray-800 disabled:bg-gray-400">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
      <div>
         <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
         <div className="border p-6 rounded bg-gray-50">
            {cart.items.map(item => (
              <div key={item._id} className="flex justify-between border-b pb-2 mb-2">
                <span>{item.quantity}x {item.product.name} ({item.size}, {item.color})</span>
                <span>\$\{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span>Subtotal</span>
              <span>\$\{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span>Shipping</span>
              <span>\$\{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 font-bold text-lg border-t mt-4">
              <span>Total</span>
              <span>\$\{total.toFixed(2)}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
`);

write('src/pages/Orders.jsx', `import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (orders.length === 0) return <div className="p-8 text-center">You have no orders yet.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="border rounded p-6 shadow-sm">
            <div className="flex justify-between border-b pb-4 mb-4">
              <div>
                <p className="text-gray-500 text-sm">Order ID</p>
                <p className="font-semibold">{order._id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Date</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="font-semibold">\$\{order.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <span className={\`px-2 py-1 rounded text-xs font-semibold \${order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}\`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>
            <div>
              {order.orderItems.map(item => (
                <div key={item._id} className="flex items-center space-x-4 mb-4">
                  {item.image ? <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" /> : <div className="w-16 h-16 bg-gray-200 rounded"></div>}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

write('src/pages/Wishlist.jsx', `import { useEffect, useState } from 'react';
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
    await api.delete(\`/wishlist/\${id}\`);
    fetchWishlist();
    toast.success('Removed from wishlist');
  };

  if (loading) return <div className="p-8 text-center">Loading wishlist...</div>;
  if (!wishlist || wishlist.products.length === 0) return <div className="p-8 text-center">Your wishlist is empty.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.products.map(product => (
          <div key={product._id} className="border rounded p-4 relative">
            <button onClick={() => removeProduct(product._id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow z-10">X</button>
            <Link to={\`/product/\${product._id}\`}>
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded mb-4">
                {product.images?.[0] && <img src={product.images[0]} className="object-cover w-full h-48 rounded" />}
              </div>
              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
              <p className="text-gray-500">\$\{(product.salePrice || product.price).toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

// To add to wishlist from ProductDetails
write('src/store/wishlistStore.js', `// Optional helper file, not strictly required since we manage wishlist via local state in the page, but let's keep it simple without adding a new store.
`);

console.log('Pages generated!');
