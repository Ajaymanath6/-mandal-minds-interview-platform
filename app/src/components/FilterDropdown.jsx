import { useState, useRef, useEffect } from "react";
import { RiSearchLine, RiArrowDownSLine } from "@remixicon/react";

// Indian states data
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// Sample countries (can be expanded)
const countries = [
  { name: 'India', flag: '🇮🇳', states: indianStates },
  { name: 'United States', flag: '🇺🇸', states: ['California', 'New York', 'Texas', 'Florida', 'Illinois'] },
  { name: 'United Kingdom', flag: '🇬🇧', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { name: 'Canada', flag: '🇨🇦', states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'] },
];

export default function FilterDropdown({
  isOpen,
  onClose,
  dropdownRef,
  position = { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' },
  width = '300px',
  selectedOption = null,
  onSelect
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // India by default
  const [selectedState, setSelectedState] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStates, setShowStates] = useState(false);
  const searchInputRef = useRef(null);

  // Initialize with India and its states if no selection
  useEffect(() => {
    if (selectedOption && selectedOption.country) {
      const country = countries.find(c => c.name === selectedOption.country);
      if (country) {
        setSelectedCountry(country);
        if (selectedOption.state) {
          setSelectedState(selectedOption.state);
          setShowStates(true);
        }
      }
    } else {
      // Default to India
      setSelectedCountry(countries[0]);
      setShowStates(true);
    }
  }, [selectedOption]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current && !showCountryDropdown) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, showCountryDropdown]);

  // Filter countries/states based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStates = selectedCountry?.states.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setShowStates(true);
    setSearchQuery("");
    setSelectedState(null);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    if (onSelect) {
      onSelect({ label: `${state}, ${selectedCountry.name}`, country: selectedCountry.name, state: state });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute bg-white rounded-lg border z-50 flex flex-col"
      style={{
        width: width,
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        padding: '8px',
        gap: '8px',
        borderColor: '#E5E5E5',
        borderWidth: '1px',
        boxShadow: '0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A',
        borderRadius: '8px',
        maxHeight: '400px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Country Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
          className="w-full flex items-center justify-between px-3 py-2 border border-[#E5E5E5] rounded-lg hover:bg-[#F5F5F5] transition-colors"
          style={{ fontFamily: 'Open Sans' }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '18px' }}>{selectedCountry.flag}</span>
            <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
              {selectedCountry.name}
            </span>
          </div>
          <RiArrowDownSLine size={16} style={{ color: '#575757' }} />
        </button>
        
        {/* Country Dropdown */}
        {showCountryDropdown && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-50"
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          >
            {countries.map((country, index) => (
              <button
                key={index}
                onClick={() => handleCountrySelect(country)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F5F5F5] transition-colors text-left"
                style={{ fontFamily: 'Open Sans' }}
              >
                <span style={{ fontSize: '18px' }}>{country.flag}</span>
                <span 
                  className="text-sm font-medium" 
                  style={{ 
                    color: selectedCountry.name === country.name ? '#1A1A1A' : '#1A1A1A', 
                    fontFamily: 'Open Sans',
                    fontWeight: selectedCountry.name === country.name ? 600 : 500
                  }}
                >
                  {country.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Input for States */}
      {showStates && (
        <div className="relative">
          <RiSearchLine 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: '#A5A5A5' }}
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search states..."
            className="w-full pl-10 pr-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#7c00ff] text-sm"
            style={{ 
              fontFamily: 'Open Sans', 
              color: '#1A1A1A',
            }}
          />
          <style>{`
            input::placeholder {
              color: #A5A5A5 !important;
            }
          `}</style>
        </div>
      )}

      {/* States List */}
      {showStates && (
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '250px' }}>
          {filteredStates.length > 0 ? (
            filteredStates.map((state, index) => (
              <button
                key={index}
                onClick={() => handleStateSelect(state)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-[#F5F5F5] text-left"
                style={{ fontFamily: 'Open Sans' }}
              >
                <span 
                  className="text-sm font-medium" 
                  style={{ 
                    color: selectedState === state ? '#1A1A1A' : '#1A1A1A', 
                    fontFamily: 'Open Sans',
                    fontWeight: selectedState === state ? 600 : 500
                  }}
                >
                  {state}
                </span>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-[#575757]" style={{ fontFamily: 'Open Sans' }}>
              No states found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

