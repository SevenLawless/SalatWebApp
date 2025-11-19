import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/auth.js';
import { t } from '../utils/translations.js';
import '../styles/App.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getUser();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">{t('navbar.brand')}</div>
      <div className="navbar-links">
        <Link
          to="/tracker"
          className={`navbar-link ${location.pathname === '/tracker' ? 'active' : ''}`}
        >
          {t('navbar.tracker')}
        </Link>
        <Link
          to="/statistics"
          className={`navbar-link ${location.pathname === '/statistics' ? 'active' : ''}`}
        >
          {t('navbar.statistics')}
        </Link>
        <div className="navbar-user">
          <span className="user-info">{currentUser.username}</span>
          <button className="logout-button" onClick={handleLogout}>
            {t('navbar.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

