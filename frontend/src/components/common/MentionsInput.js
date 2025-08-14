import React, { useState, useEffect, useRef } from 'react';
import config from '../../config/config';

const MentionsInput = ({ value, onChange, placeholder, rows = 3, disabled = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Debounced search function
  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        setSearchResults(result.data || []);
        setShowDropdown(result.data && result.data.length > 0);
        setSelectedIndex(0);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle textarea changes
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Check if we need to show @mentions dropdown
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      const query = textBeforeCursor.substring(lastAtSymbol + 1);
      setSearchQuery(query);
      setCursorPosition(cursorPos);
      
      // Debounce the search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(query);
      }, 300);
    } else {
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  // Handle key navigation in dropdown
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          insertMention(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  // Insert selected mention
  const insertMention = (user) => {
    const textBeforeAt = value.substring(0, cursorPosition - searchQuery.length - 1);
    const textAfterCursor = value.substring(cursorPosition);
    const newValue = `${textBeforeAt}@${user.name} ${textAfterCursor}`;
    
    onChange(newValue);
    setShowDropdown(false);
    setSearchResults([]);
    setSearchQuery('');
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = textBeforeAt.length + user.name.length + 2; // +2 for @ and space
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '16px',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />
      
      {/* @Mentions Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {isSearching ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              Searching...
            </div>
          ) : searchResults.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              No users found
            </div>
          ) : (
            searchResults.map((user, index) => (
              <div
                key={user.id}
                onClick={() => insertMention(user)}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  backgroundColor: index === selectedIndex ? '#f0f8ff' : 'transparent',
                  borderBottom: index < searchResults.length - 1 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {user.email}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MentionsInput;
