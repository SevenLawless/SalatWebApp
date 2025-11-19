import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser, getUserByPhone, setCurrentUser } from '../utils/localStorage';
import '../styles/App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      // Check if user exists
      let user = getUserByPhone(phoneNumber.trim());
      
      if (!user) {
        // Register new user
        user = addUser(username.trim(), phoneNumber.trim());
      } else {
        // Update username if changed (phone number is primary identifier)
        if (user.username !== username.trim()) {
          user.username = username.trim();
          const users = JSON.parse(localStorage.getItem('salatChecker_users') || '[]');
          const userIndex = users.findIndex(u => u.phoneNumber === phoneNumber.trim());
          if (userIndex >= 0) {
            users[userIndex].username = username.trim();
            localStorage.setItem('salatChecker_users', JSON.stringify(users));
          }
        }
      }

      // Set current user and redirect
      setCurrentUser(phoneNumber.trim());
      navigate('/tracker');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Salat Checker</h1>
        <p>Track your daily prayers</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Login / Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

