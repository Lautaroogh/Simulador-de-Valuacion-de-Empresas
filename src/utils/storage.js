/**
 * LocalStorage Utility Functions
 * Handles persistence of valuations and user preferences
 */

const STORAGE_KEYS = {
    VALUATIONS: 'valuapyme_valuaciones',
    CONFIG: 'valuapyme_configuracion',
    API_KEY: 'valuapyme_api_key_session' // Session only, not persisted
};

/**
 * Get all saved valuations
 * @returns {Array} Array of saved valuation objects
 */
export function getValuations() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.VALUATIONS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading valuations from storage:', error);
        return [];
    }
}

/**
 * Save a new valuation
 * @param {Object} valuation - Valuation data to save
 * @returns {string} ID of saved valuation
 */
export function saveValuation(valuation) {
    try {
        const valuations = getValuations();
        const newValuation = {
            ...valuation,
            id: Date.now().toString(),
            fecha: new Date().toISOString()
        };
        valuations.unshift(newValuation); // Add to beginning

        // Keep max 20 valuations
        if (valuations.length > 20) {
            valuations.pop();
        }

        localStorage.setItem(STORAGE_KEYS.VALUATIONS, JSON.stringify(valuations));
        return newValuation.id;
    } catch (error) {
        console.error('Error saving valuation:', error);
        throw error;
    }
}

/**
 * Delete a valuation by ID
 * @param {string} id - Valuation ID to delete
 * @returns {boolean} Success status
 */
export function deleteValuation(id) {
    try {
        const valuations = getValuations();
        const filtered = valuations.filter(v => v.id !== id);
        localStorage.setItem(STORAGE_KEYS.VALUATIONS, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error deleting valuation:', error);
        return false;
    }
}

/**
 * Get a specific valuation by ID
 * @param {string} id - Valuation ID
 * @returns {Object|null} Valuation object or null
 */
export function getValuationById(id) {
    const valuations = getValuations();
    return valuations.find(v => v.id === id) || null;
}

/**
 * Update an existing valuation
 * @param {string} id - Valuation ID to update
 * @param {Object} updates - Fields to update
 * @returns {boolean} Success status
 */
export function updateValuation(id, updates) {
    try {
        const valuations = getValuations();
        const index = valuations.findIndex(v => v.id === id);

        if (index === -1) return false;

        valuations[index] = { ...valuations[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.VALUATIONS, JSON.stringify(valuations));
        return true;
    } catch (error) {
        console.error('Error updating valuation:', error);
        return false;
    }
}

/**
 * Get user configuration
 * @returns {Object} Configuration object
 */
export function getConfig() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
        return stored ? JSON.parse(stored) : {
            modoOscuro: false,
            unidadMoneda: 'USD',
            mostrarTutorial: true
        };
    } catch (error) {
        console.error('Error reading config:', error);
        return { modoOscuro: false, unidadMoneda: 'USD', mostrarTutorial: true };
    }
}

/**
 * Save user configuration
 * @param {Object} config - Configuration object
 */
export function saveConfig(config) {
    try {
        const current = getConfig();
        const updated = { ...current, ...config };
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    } catch (error) {
        console.error('Error saving config:', error);
    }
}

/**
 * Clear all stored data
 */
export function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEYS.VALUATIONS);
        localStorage.removeItem(STORAGE_KEYS.CONFIG);
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}

/**
 * Export all valuations as JSON
 * @returns {string} JSON string of all valuations
 */
export function exportValuationsJSON() {
    const valuations = getValuations();
    return JSON.stringify(valuations, null, 2);
}

/**
 * Import valuations from JSON
 * @param {string} jsonString - JSON string to import
 * @returns {number} Number of valuations imported
 */
export function importValuationsJSON(jsonString) {
    try {
        const imported = JSON.parse(jsonString);
        if (!Array.isArray(imported)) throw new Error('Invalid format');

        const current = getValuations();
        const merged = [...imported, ...current].slice(0, 20);

        localStorage.setItem(STORAGE_KEYS.VALUATIONS, JSON.stringify(merged));
        return imported.length;
    } catch (error) {
        console.error('Error importing valuations:', error);
        throw error;
    }
}

/**
 * Store API key in session storage (not persisted)
 * @param {string} key - API key
 */
export function setApiKey(key) {
    sessionStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

/**
 * Get API key from session storage
 * @returns {string|null} API key or null
 */
export function getApiKey() {
    return sessionStorage.getItem(STORAGE_KEYS.API_KEY);
}

/**
 * Clear API key from session
 */
export function clearApiKey() {
    sessionStorage.removeItem(STORAGE_KEYS.API_KEY);
}
