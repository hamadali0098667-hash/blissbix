import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', gender: 'Men', image: '' });

  const fetchProducts = () => {
    api.get('/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch(err) { toast.error('Error deleting product'); }
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        variants: [{ size: 'M', color: 'Default', stock: 100 }],
        images: [newProduct.image || 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg']
      };
      await api.post('/products', payload);
      toast.success('Product added successfully!');
      setShowAdd(false);
      fetchProducts();
    } catch(err) {
      toast.error('Failed to add product');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Products Inventory</h2>
          <p className="text-gray-500 mt-1">Manage your store catalog</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition flex items-center font-medium">
          {showAdd ? 'Cancel' : <><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> Add Product</>}
        </button>
      </div>
      
      {showAdd && (
        <form onSubmit={addProduct} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all">
          <h3 className="font-bold text-xl mb-6 text-gray-800 border-b pb-4">Create New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
               <input required value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
               <input required type="number" step="0.01" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Category / Gender</label>
               <select value={newProduct.gender} onChange={e=>setNewProduct({...newProduct, gender: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border bg-white">
                 <option value="Men">Men</option>
                 <option value="Women">Women</option>
                 <option value="Accessories">Accessories</option>
               </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input required value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image: e.target.value})} placeholder="https://..." className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea required rows="1" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition font-medium">Save Product</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img className="h-12 w-12 rounded-lg object-cover border" src={p.images?.[0] || 'https://via.placeholder.com/50'} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-500">{p._id.substring(0,8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">${p.price?.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {p.gender}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
