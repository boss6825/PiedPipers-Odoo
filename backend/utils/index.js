/**
 * Format error response
 * @param {Error} err - Error object
 * @returns {Object} Formatted error
 */
const formatError = (err) => {
    return {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    };
};

/**
 * Extract user mention from text
 * @param {string} text - Text to extract mentions from
 * @returns {Array} Array of usernames mentioned
 */
const extractMentions = (text) => {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const matches = text.match(mentionRegex);

    if (!matches) return [];

    return matches.map(mention => mention.substring(1));
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
const sanitizeHtml = (html) => {
    // Simple sanitization - in production use a library like DOMPurify
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/g, '')
        .replace(/on\w+='[^']*'/g, '');
};

/**
 * Generate a random avatar URL
 * @param {string} username - Username to generate avatar for
 * @returns {string} Avatar URL
 */
const generateAvatar = (username) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
};

/**
 * Paginate results
 * @param {Array} data - Data to paginate
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Paginated data
 */
const paginate = (data, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = data.length;

    const paginatedData = data.slice(startIndex, endIndex);

    const pagination = {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: endIndex < total,
    };

    return { data: paginatedData, pagination };
};

module.exports = {
    formatError,
    extractMentions,
    sanitizeHtml,
    generateAvatar,
    paginate,
}; 