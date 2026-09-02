const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

// 1. Backend: Add delete order controller & route
let orderCtrl = fs.readFileSync('server/controllers/order.controller.js', 'utf8');
if (!orderCtrl.includes('deleteOrder')) {
  orderCtrl = orderCtrl.replace('module.exports = {', 
\`const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {\`);
  orderCtrl = orderCtrl.replace('module.exports = {', 'module.exports = { deleteOrder, ');
  fs.writeFileSync('server/controllers/order.controller.js', orderCtrl);
}

let orderRoutes = fs.readFileSync('server/routes/order.routes.js', 'utf8');
if (!orderRoutes.includes('deleteOrder')) {
  orderRoutes = orderRoutes.replace('updateOrderStatus } = require', 'updateOrderStatus, deleteOrder } = require');
  orderRoutes = orderRoutes.replace("router.route('/:id').get(protect, getOrderById);", "router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);");
  fs.writeFileSync('server/routes/order.routes.js', orderRoutes);
}

// 2. Backend: Add delete user controller & route
let authCtrl = fs.readFileSync('server/controllers/auth.controller.js', 'utf8');
if (!authCtrl.includes('deleteUser')) {
  authCtrl = authCtrl.replace('module.exports = {', 
\`const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {\`);
  authCtrl = authCtrl.replace('module.exports = {', 'module.exports = { deleteUser, ');
  fs.writeFileSync('server/controllers/auth.controller.js', authCtrl);
}

let authRoutes = fs.readFileSync('server/routes/auth.routes.js', 'utf8');
if (!authRoutes.includes('deleteUser')) {
  authRoutes = authRoutes.replace('getAllUsers, updateUserProfile', 'getAllUsers, updateUserProfile, deleteUser');
  authRoutes += "\\nrouter.delete('/users/:id', protect, admin, deleteUser);\\n";
  fs.writeFileSync('server/routes/auth.routes.js', authRoutes);
}

// 3. Frontend: Update AdminProducts (Add Image URL field)
let adminProd = fs.readFileSync('client/src/pages/admin/AdminProducts.jsx', 'utf8');
if (!adminProd.includes('image:')) {
  adminProd = adminProd.replace('const [newProduct, setNewProduct] = useState({ name: \'\', price: \'\', description: \'\', category: \'Men\' });', 
    'const [newProduct, setNewProduct] = useState({ name: \'\', price: \'\', description: \'\', category: \'Men\', image: \'\' });');
    
  adminProd = adminProd.replace('const handleCreate = async (e) => {\\n    e.preventDefault();', 
    \`const handleCreate = async (e) => {\\n    e.preventDefault();\\n    const productData = { ...newProduct, images: [newProduct.image || 'https://placehold.co/800x800?text=No+Image'], variants: [{size: 'M', color: 'Black', stock: 10}] };\`);
    
  adminProd = adminProd.replace('await api.post(\\'/products\\', newProduct);', 'await api.post(\\'/products\\', productData);');
  
  // Add input field for Image URL before Description
  adminProd = adminProd.replace('<div className="md:col-span-2">\\n                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>',
    \`<div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Product Image URL</label>
      <input required value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image: e.target.value})} placeholder="https://example.com/image.jpg" className="w-full border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 border bg-gray-50" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>\`);
      
  fs.writeFileSync('client/src/pages/admin/AdminProducts.jsx', adminProd);
}

// 4. Frontend: Update AdminOrders (Add Delete Button)
let adminOrd = fs.readFileSync('client/src/pages/admin/AdminOrders.jsx', 'utf8');
if (!adminOrd.includes('deleteOrder')) {
  adminOrd = adminOrd.replace('import api from \\'../../services/api\\';', "import api from '../../services/api';\\nimport { Trash2 } from 'lucide-react';");
  
  const deleteFunc = \`
  const deleteOrder = async (id) => {
    if(!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(\\\`/orders/\\\${id}\\\`);
      setOrders(orders.filter(o => o._id !== id));
      toast.success('Order deleted');
    } catch(err) { toast.error('Error deleting order'); }
  };
  \`;
  adminOrd = adminOrd.replace('const updateStatus = async (id, status) => {', deleteFunc + '\\n  const updateStatus = async (id, status) => {');
  
  adminOrd = adminOrd.replace('</th>\\n              </tr>', '</th>\\n                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Delete</th>\\n              </tr>');
  
  adminOrd = adminOrd.replace('</td>\\n              </tr>', \`</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button onClick={() => deleteOrder(order._id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>\`);
              
  fs.writeFileSync('client/src/pages/admin/AdminOrders.jsx', adminOrd);
}

// 5. Frontend: Update AdminUsers (Add Delete Button)
let adminUsers = fs.readFileSync('client/src/pages/admin/AdminUsers.jsx', 'utf8');
if (!adminUsers.includes('deleteUser')) {
  adminUsers = adminUsers.replace('import api from \\'../../services/api\\';', "import api from '../../services/api';\\nimport { Trash2 } from 'lucide-react';");
  
  const deleteUserFunc = \`
  const deleteUser = async (id) => {
    if(!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(\\\`/auth/users/\\\${id}\\\`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch(err) { toast.error('Error deleting user'); }
  };
  \`;
  adminUsers = adminUsers.replace('if (loading) return', deleteUserFunc + '\\n  if (loading) return');
  
  adminUsers = adminUsers.replace('</th>\\n              </tr>', '</th>\\n                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Delete</th>\\n              </tr>');
  
  adminUsers = adminUsers.replace('</td>\\n              </tr>', \`</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button onClick={() => deleteUser(user._id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>\`);
              
  fs.writeFileSync('client/src/pages/admin/AdminUsers.jsx', adminUsers);
}

console.log('Admin Panel completely patched with image URL, delete orders, and delete users!');
