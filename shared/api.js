// C:\quick_wrks\frontend\shared\api.js

/**
 * Minimal shared API helper for QuickWrks.
 * Handles prepending backend URL, sending credentials, and CSRF protection.
 */

const API_BASE = "https://quickwrks-backend.onrender.com";

// Extract CSRF token from cookies if present
function getCsrfToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; qw_csrf=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Makes an API request to the backend.
 * @param {string} path - API endpoint (e.g., "/api/auth/login")
 * @param {object} options - Fetch options (method, body, etc.)
 */
async function apiRequest(path, options = {}) {
    const url = `${API_BASE}${path}`;

    // Default configurations
    const fetchOptions = {
        ...options,
        credentials: "include", // Required for qw_session cookie
        headers: {
            ...options.headers,
        }
    };

    // If body is an object, convert to JSON and set Content-Type
    if (fetchOptions.body && typeof fetchOptions.body === 'object' && !(fetchOptions.body instanceof FormData)) {
        fetchOptions.body = JSON.stringify(fetchOptions.body);
        fetchOptions.headers["Content-Type"] = "application/json";
    }

    // Attach CSRF token for state-changing requests
    const method = (fetchOptions.method || "GET").toUpperCase();
    if (["POST", "PATCH", "DELETE", "PUT"].includes(method)) {
        const csrf = getCsrfToken();
        if (csrf) {
            fetchOptions.headers["X-CSRF-Token"] = csrf;
        }
    }

    try {
        const response = await fetch(url, fetchOptions);

        // Handle unauthenticated state globally (unless explicitly ignored)
        if (response.status === 401 && !fetchOptions.ignore401) {
            // Determine relative path to login based on current path
            const isDashboard = window.location.pathname.includes('/dashboard/');
            window.location.href = isDashboard ? "../login.html" : "login.html";
            return null; // Stop execution
        }

        return response;
    } catch (error) {
        console.error("API Request Failed:", error);
        throw error;
    }
}

// Attach to window so static scripts can use it
window.qwApi = {
    request: apiRequest,
    get: (path, options = {}) => apiRequest(path, { ...options, method: 'GET' }),
    post: (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body }),
    patch: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PATCH', body }),
    delete: (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' }),
};
