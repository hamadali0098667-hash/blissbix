import { useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, checkAuth } = useAuthStore();
  
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/me', { name, email });
      localStorage.setItem('token', res.data.token);
      await checkAuth(); // Refresh Zustand user state
      toast.success('Profile updated successfully!');
      setShowEditProfile(false);
    } catch(err) { toast.error(err.response?.data?.message || 'Error updating profile'); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setShowPassword(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch(err) { toast.error(err.response?.data?.message || 'Error changing password'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in relative">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-gray-500 mt-2">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md border-2 border-white">
                <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </div>
              </div>
              <div className="ml-6 mt-12">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 uppercase tracking-wide">
                  Active {user.role}
                </span>
              </div>
            </div>
            <button onClick={() => setShowEditProfile(true)} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center mb-4 text-gray-500">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <h3 className="font-semibold uppercase tracking-wider text-sm">Email Address</h3>
              </div>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center mb-4 text-gray-500">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <h3 className="font-semibold uppercase tracking-wider text-sm">Security</h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-gray-900">••••••••</p>
                <button onClick={() => setShowPassword(true)} className="text-indigo-600 text-sm font-medium hover:underline">Change Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditProfile(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input required type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input required type="password" minLength="6" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowPassword(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
