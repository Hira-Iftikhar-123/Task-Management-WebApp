import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (user) {
    window.location.href = '/tasks';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-800 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm min-h-[500px] bg-white/10 backdrop-blur-md 
            rounded-2xl shadow-2xl px-10 py-16 
            border border-purple-400/20 text-center 
            flex flex-col justify-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img src="/concept.png" alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        {/* Tagline */}
        <p className="text-purple-100 text-lg mb-10">
          Stay organized, stay Productive!
        </p>

        {/* Action Button */}
        <Link
          to="/login"
          className="inline-block px-10 py-4 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          Get Started
        </Link>

        {/* Subtext */}
        <p className="text-sm text-purple-300 mt-6">
          Don’t have an account yet? <Link to="/register" className="underline hover:text-white-200">Sign up here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;