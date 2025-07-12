const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (id) => {
    return await User.findById(id).select('-password');
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User object
 */
const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
    return await User.create(userData);
};

/**
 * Update user data
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (userId, updateData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            user[key] = updateData[key];
        }
    });

    return await user.save();
};

module.exports = {
    generateToken,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
}; 