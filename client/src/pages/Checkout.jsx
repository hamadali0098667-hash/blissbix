import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  if (!cart || cart.items.length === 0) {
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
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 font-bold text-lg border-t mt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
