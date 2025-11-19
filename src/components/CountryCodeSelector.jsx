import { useState, useRef, useEffect } from 'react';
import '../styles/App.css';

const countries = [
  { code: '+212', name: 'المغرب', flag: '🇲🇦' },
  { code: '+213', name: 'الجزائر', flag: '🇩🇿' },
  { code: '+216', name: 'تونس', flag: '🇹🇳' },
  { code: '+218', name: 'ليبيا', flag: '🇱🇾' },
  { code: '+20', name: 'مصر', flag: '🇪🇬' },
  { code: '+966', name: 'السعودية', flag: '🇸🇦' },
  { code: '+971', name: 'الإمارات', flag: '🇦🇪' },
  { code: '+974', name: 'قطر', flag: '🇶🇦' },
  { code: '+965', name: 'الكويت', flag: '🇰🇼' },
  { code: '+973', name: 'البحرين', flag: '🇧🇭' },
  { code: '+968', name: 'عمان', flag: '🇴🇲' },
  { code: '+961', name: 'لبنان', flag: '🇱🇧' },
  { code: '+962', name: 'الأردن', flag: '🇯🇴' },
  { code: '+964', name: 'العراق', flag: '🇮🇶' },
  { code: '+963', name: 'سوريا', flag: '🇸🇾' },
  { code: '+970', name: 'فلسطين', flag: '🇵🇸' },
  { code: '+961', name: 'لبنان', flag: '🇱🇧' },
  { code: '+1', name: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: '+44', name: 'المملكة المتحدة', flag: '🇬🇧' },
  { code: '+33', name: 'فرنسا', flag: '🇫🇷' },
  { code: '+49', name: 'ألمانيا', flag: '🇩🇪' },
  { code: '+39', name: 'إيطاليا', flag: '🇮🇹' },
  { code: '+34', name: 'إسبانيا', flag: '🇪🇸' },
];

const CountryCodeSelector = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to Morocco
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Extract country code from value if it exists
    if (value) {
      const country = countries.find(c => value.startsWith(c.code));
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    
    // Extract phone number without country code from current value
    const currentValue = value || '';
    const currentCode = selectedCountry.code;
    let phoneNumber = currentValue;
    
    // Remove old country code if present
    if (currentValue.startsWith(currentCode)) {
      phoneNumber = currentValue.substring(currentCode.length).trim();
    }
    
    // Combine new country code with phone number
    const newValue = country.code + (phoneNumber || '');
    onChange({ target: { name: 'phoneNumber', value: newValue } });
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    
    // Always ensure country code is present
    if (!inputValue.startsWith('+')) {
      // If no +, add selected country code
      onChange({ target: { name: 'phoneNumber', value: selectedCountry.code + inputValue } });
    } else {
      // Check if the input starts with any country code
      const matchedCountry = countries.find(c => inputValue.startsWith(c.code));
      if (matchedCountry && matchedCountry.code !== selectedCountry.code) {
        // Update selected country if a different one is detected
        setSelectedCountry(matchedCountry);
      }
      onChange(e);
    }
  };

  // Display value: show full number if exists, otherwise show just country code
  const displayValue = value || selectedCountry.code;

  return (
    <div className="country-code-selector" ref={dropdownRef}>
      <div className="phone-input-wrapper">
        <button
          type="button"
          className="country-code-button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className="country-flag">{selectedCountry.flag}</span>
          <span className="country-code">{selectedCountry.code}</span>
          <span className="dropdown-arrow">▼</span>
        </button>
        <input
          type="tel"
          className="phone-input"
          value={displayValue}
          onChange={handlePhoneChange}
          placeholder="أدخل رقم الهاتف"
          disabled={disabled}
          dir="ltr"
        />
      </div>
      {isOpen && (
        <div className="country-dropdown">
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
              onClick={() => handleCountrySelect(country)}
            >
              <span className="country-flag">{country.flag}</span>
              <span className="country-name">{country.name}</span>
              <span className="country-code-text">{country.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelector;

