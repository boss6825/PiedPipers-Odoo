import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';
    return dayjs(date).fromNow();
};

/**
 * Format date to standard format (e.g., "Jan 1, 2023")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('MMM D, YYYY');
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return `${text.substring(0, length)}...`;
};

/**
 * Get user's initials from their name
 * @param {string} name - The user's name
 * @returns {string} User's initials (up to 2 characters)
 */
export const getUserInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Check if the user is authenticated
 * @returns {boolean} Whether the user is authenticated
 */
export const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user && !!user.token;
};

/**
 * Get the current theme mode from localStorage
 * @returns {string} Theme mode ('light' or 'dark')
 */
export const getThemeMode = () => {
    return localStorage.getItem('themeMode') || 'light';
}; 