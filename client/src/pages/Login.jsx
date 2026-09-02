import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-indigo-100 to-purple-50 blur-[100px] opacity-70"></div>
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[50%] rounded-full bg-gradient-to-tr from-gray-200 to-gray-50 blur-[120px] opacity-70"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600 font-medium">
          Sign in to your <span className="font-bold text-gray-900">Blissbix</span> account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} 
                  className="block w-full pl-11 pr-3 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50 focus:bg-white sm:text-sm font-medium" 
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">Password</label>
                <div className="text-sm">
                  <a href="#" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</a>
                </div>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} 
                  className="block w-full pl-11 pr-3 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50 focus:bg-white sm:text-sm font-medium" 
                  placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-black border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-900">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button disabled={loading} type="submit" 
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group">
                {loading ? 'Signing in...' : (
                  <>Sign in <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>

          {/* Fast Login Options for Testing/Demo */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">Fast Login (Demo)</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { setEmail('admin@blissbix.com'); setPassword('password123'); }} 
                className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl text-sm font-bold transition-colors">
                Fill Admin
              </button>
              <button onClick={() => { setEmail('hamadali00@gmail.com'); setPassword('ali123'); }} 
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 rounded-xl text-sm font-bold transition-colors">
                Fill Customer
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
