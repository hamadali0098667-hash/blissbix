export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Blissbix.</h3>
          <p className="text-gray-400 text-sm">Your ultimate fashion destination. Premium quality, modern designs.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
            <li>New Arrivals</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Shipping & Returns</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <div className="flex">
            <input type="email" placeholder="Your email" className="px-4 py-2 w-full text-black rounded-l" />
            <button className="bg-white text-black px-4 py-2 font-semibold rounded-r">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-800 pt-8">
        © {new Date().getFullYear()} Blissbix Fashion Store. All rights reserved.
      </div>
    </footer>
  );
}
