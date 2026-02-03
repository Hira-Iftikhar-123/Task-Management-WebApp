import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/tasks" /> : <Dashboard />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/tasks" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/tasks" /> : <Register />}
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TaskList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;