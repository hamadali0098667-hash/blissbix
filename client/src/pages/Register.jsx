import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      toast.success('Account created successfully! Welcome to Blissbix.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-100 to-purple-50 blur-[100px] opacity-70"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full bg-gradient-to-tl from-gray-200 to-gray-50 blur-[120px] opacity-70"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">Blissbix.</span>
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600 font-medium">
          Create an account to unlock premium features and fast checkout.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" required onChange={handleChange} 
                  className="block w-full pl-11 pr-3 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50 focus:bg-white sm:text-sm font-medium" 
                  placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" required onChange={handleChange} 
                  className="block w-full pl-11 pr-3 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50 focus:bg-white sm:text-sm font-medium" 
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input type="tel" name="phone" onChange={handleChange} 
                  className="block w-full pl-11 pr-3 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50 focus:bg-white sm:text-sm font-medium" 
                  placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" name="password" required minLength="6" onChange={handleChange} 
                  className="block w-full pl-11 pr-3 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50 focus:bg-white sm:text-sm font-medium" 
                  placeholder="At least 6 characters" />
              </div>
            </div>

            <div>
              <button disabled={loading} type="submit" 
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group">
                {loading ? 'Creating Account...' : (
                  <>Create Account <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
