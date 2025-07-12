import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import { selectUser, selectIsAuthenticated } from '../features/auth/authSlice';

/**
 * Custom hook for handling image uploads to S3 via the backend API
 * @returns {Object} Hook methods and state
 */
const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  /**
   * Upload an image to S3 via the backend API
   * @param {File} file - The image file to upload
   * @param {Function} onSuccess - Optional callback function to run on successful upload
   * @returns {Promise<string|null>} The uploaded image URL or null if failed
   */
  const uploadImage = useCallback(async (file, onSuccess) => {
    if (!isAuthenticated || !user?.token) {
      setError('You must be logged in to upload images');
      return null;
    }
    
    if (!file) {
      setError('No file selected');
      return null;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return null;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return null;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.post(`${ENDPOINTS.QUESTIONS}/image`, formData, config);
      
      if (response.data && response.data.link) {
        setUploadedImageUrl(response.data.link);
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(response.data.link);
        }
        return response.data.link;
      } else {
        throw new Error('No image URL received from server');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.error || err.message || 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [isAuthenticated, user]);
  
  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setError(null);
    setUploadedImageUrl('');
  }, []);
  
  return {
    uploadImage,
    isUploading,
    error,
    uploadedImageUrl,
    reset
  };
};

export default useImageUpload; 