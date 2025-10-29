
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../../styles.css';

const LoginPage: React.FC = () => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
    }
  };

    return (
    <div
      className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-100/50 pt-[120px]"
    >
      <div
        className="bg-white p-[30px] max-w-[400px] w-full rounded-xl shadow-2xl border border-gray-200"
      >
        <h2 className="text-center mb-5 text-2xl font-semibold text-gray-800">
          Login
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="password"
            />
          </div>

          <button
            type="submit"
            className="
              w-full py-3 px-4 
              bg-gradient-to-r from-blue-600 to-indigo-700 
              text-white font-bold 
              rounded-lg 
              cursor-pointer 
              shadow-lg hover:shadow-xl 
              transition duration-300 ease-in-out
              transform hover:scale-[1.01] hover:-translate-y-px
            "
          >
            Login
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? 
            <a href="register" className="font-semibold text-indigo-600 hover:text-indigo-500 ml-1">
                Register
            </a>
        </p>
      </div>
    </div>
  );

};

export default LoginPage;