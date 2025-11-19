import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../services/api.js';
import { t } from '../utils/translations.js';
import CountryCodeSelector from './CountryCodeSelector';
import '../styles/App.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.username.trim()) {
      setError(t('error.usernameRequired'));
      setLoading(false);
      return;
    }

    if (formData.username.trim().length < 2) {
      setError(t('error.usernameMinLength'));
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError(t('error.phoneRequired'));
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError(t('error.passwordRequired'));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t('error.passwordMinLength'));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('error.passwordsNotMatch'));
      setLoading(false);
      return;
    }

    // Phone number validation (with country code)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setError(t('error.phoneInvalid'));
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.username.trim(), formData.phoneNumber.trim(), formData.password);
      navigate('/tracker');
    } catch (err) {
      setError(err.message || t('error.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('signUp.title')}</h1>
        <p>{t('signUp.subtitle')}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t('signUp.username')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={t('signUp.usernamePlaceholder')}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">{t('signUp.phoneNumber')}</label>
            <CountryCodeSelector
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('signUp.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('signUp.passwordPlaceholder')}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('signUp.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('signUp.confirmPasswordPlaceholder')}
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? t('signUp.creating') : t('signUp.button')}
          </button>
        </form>
        <div className="auth-switch">
          <p>{t('signUp.haveAccount')} <Link to="/signin">{t('signUp.signIn')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

