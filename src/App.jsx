import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth.js';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrayerTracker from './components/PrayerTracker';
import Statistics from './components/Statistics';
import Navbar from './components/Navbar';
import './styles/App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  return authenticated ? children : <Navigate to="/signin" replace />;
};

function App() {
  const authenticated = isAuthenticated();
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <Navigate to="/tracker" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/signup"
          element={
            authenticated ? (
              <Navigate to="/tracker" replace />
            ) : (
              <SignUp />
            )
          }
        />
        <Route
          path="/signin"
          element={
            authenticated ? (
              <Navigate to="/tracker" replace />
            ) : (
              <SignIn />
            )
          }
        />
        <Route
          path="/tracker"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <PrayerTracker />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Statistics />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

