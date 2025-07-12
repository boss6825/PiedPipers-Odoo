/**
 * API configuration
 * This file contains the base URL for API requests
 */

// Use environment variable if available, otherwise fallback to localhost
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// API endpoints
export const ENDPOINTS = {
    AUTH: `${API_BASE_URL}/api/auth`,
    QUESTIONS: `${API_BASE_URL}/api/questions`,
    ANSWERS: `${API_BASE_URL}/api`,
    NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
};

export default ENDPOINTS; 