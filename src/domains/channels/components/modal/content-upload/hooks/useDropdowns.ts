import { useState, useRef, useEffect } from 'react';

export const useDropdowns = () => {
  // Edit dropdown state
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const editDropdownRef = useRef<HTMLDivElement | null>(null);
  const [editDropdownStyle, setEditDropdownStyle] = useState<React.CSSProperties>({});

  // Input type dropdown state
  const [isInputTypeDropdownOpen, setIsInputTypeDropdownOpen] = useState(false);
  const inputTypeDropdownRef = useRef<HTMLDivElement | null>(null);
  const inputTypeDropdownPanelRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editDropdownRef?.current && !editDropdownRef.current.contains(event.target as Node)) {
        setIsEditDropdownOpen(false);
      }
      if (
        inputTypeDropdownRef?.current &&
        !inputTypeDropdownRef.current.contains(event.target as Node) &&
        inputTypeDropdownPanelRef?.current &&
        !inputTypeDropdownPanelRef.current.contains(event.target as Node)
      ) {
        setIsInputTypeDropdownOpen(false);
      }
    };

    if (isEditDropdownOpen || isInputTypeDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isEditDropdownOpen, editDropdownRef, isInputTypeDropdownOpen, inputTypeDropdownRef]);

  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (isInputTypeDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isInputTypeDropdownOpen]);

  // Edit dropdown handlers
  const toggleEditDropdown = () => {
    if (!isEditDropdownOpen && editDropdownRef?.current) {
      // Calculate position before opening
      const rect = editDropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 100; // Approximate height of dropdown

      // Calculate dropdown position
      const shouldOpenTop = rect.bottom + dropdownHeight > viewportHeight - 50;

      // Calculate absolute position for portal
      const dropdownStyle: React.CSSProperties = {
        position: 'fixed',
        right: window.innerWidth - rect.right,
        width: 192, // w-48 = 12rem = 192px
        zIndex: 9999,
      };

      if (shouldOpenTop) {
        dropdownStyle.bottom = viewportHeight - rect.top + 4; // 4px margin
      } else {
        dropdownStyle.top = rect.bottom + 4; // 4px margin
      }

      setEditDropdownStyle(dropdownStyle);
    }
    setIsEditDropdownOpen(!isEditDropdownOpen);
  };

  // Input type dropdown handlers
  const toggleInputTypeDropdown = () => {
    if (!isInputTypeDropdownOpen && inputTypeDropdownRef?.current) {
      // Calculate position before opening
      const rect = inputTypeDropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200; // Approximate height of dropdown

      setDropdownRect(rect);

      // Calculate dropdown position
      const shouldOpenTop = rect.bottom + dropdownHeight > viewportHeight - 50;
      setDropdownPosition(shouldOpenTop ? 'top' : 'bottom');

      // Calculate absolute position for portal
      const dropdownStyle: React.CSSProperties = {
        position: 'fixed',
        left: rect.left,
        width: 192, // w-48 = 12rem = 192px
        zIndex: 9999,
      };

      if (shouldOpenTop) {
        dropdownStyle.bottom = viewportHeight - rect.top + 4; // 4px margin
      } else {
        dropdownStyle.top = rect.bottom + 4; // 4px margin
      }

      setDropdownStyle(dropdownStyle);
    }
    setIsInputTypeDropdownOpen(!isInputTypeDropdownOpen);
  };

  return {
    // Edit dropdown
    isEditDropdownOpen,
    setIsEditDropdownOpen,
    editDropdownRef,
    editDropdownStyle,
    toggleEditDropdown,

    // Input type dropdown
    isInputTypeDropdownOpen,
    setIsInputTypeDropdownOpen,
    inputTypeDropdownRef,
    inputTypeDropdownPanelRef,
    dropdownPosition,
    dropdownRect,
    dropdownStyle,
    toggleInputTypeDropdown,
  };
};
