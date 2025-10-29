import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/auth';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await registerApi(name, email, password, passwordConfirmation);

      setMessage({ type: 'success', text: 'Registration successful! Please login now.' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred.';

      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        errorMessage = Object.values(validationErrors).flat()[0] as string;
      } else {
        errorMessage = err.response?.data?.message || err.message;
      }

      setMessage({ type: 'error', text: errorMessage });

    } finally {
      setLoading(false);
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
          Create New Account
        </h2>

        {message && (
          <div className={`p-4 mb-4 rounded-lg font-medium text-sm ${message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Confirm Password:</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
                w-full py-3 px-4 
                bg-gradient-to-r from-blue-600 to-indigo-700 
                text-white font-bold 
                rounded-lg 
                cursor-pointer 
                shadow-lg hover:shadow-xl 
                transition duration-300 ease-in-out
                transform ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01] hover:-translate-y-px'}
              `}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 ml-1">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;