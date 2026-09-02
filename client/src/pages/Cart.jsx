import { Link, useNavigate } from 'react-router-dom';
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
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
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
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping estimate</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
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
