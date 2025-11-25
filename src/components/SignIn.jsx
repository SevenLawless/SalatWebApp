import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../services/api.js';
import { t } from '../utils/translations.js';
import CountryCodeSelector from './CountryCodeSelector';
import '../styles/App.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handlePhoneChange = (e) => {
    setFormData({
      ...formData,
      phoneNumber: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.phoneNumber.trim()) {
      setError(t('error.phoneRequired'));
      setLoading(false);
      return;
    }

    try {
      await signIn(formData.phoneNumber.trim());
      navigate('/tracker');
    } catch (err) {
      setError(err.message || t('error.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('signIn.title')}</h1>
        <p>{t('signIn.subtitle')}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phoneNumber">{t('signIn.phoneNumber')}</label>
            <CountryCodeSelector
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? t('signIn.signingIn') : t('signIn.button')}
          </button>
        </form>
        <div className="auth-switch">
          <p>{t('signIn.noAccount')} <Link to="/signup">{t('signIn.signUp')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

