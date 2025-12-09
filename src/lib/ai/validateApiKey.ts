/**
 * API Key Validation Utility
 * Validates Gemini API key on startup and caches available models.
 */

interface ModelInfo {
    name: string;
    displayName: string;
    supportsGenerate: boolean;
}

interface ValidationResult {
    isValid: boolean;
    availableModels: ModelInfo[];
    preferredModel: string | null;
    error?: string;
}

// Cache the validation result
let cachedResult: ValidationResult | null = null;
let lastValidation: number = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Preferred models in order of priority
const PREFERRED_MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-flash-latest",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001"
];

export async function validateApiKey(forceRefresh = false): Promise<ValidationResult> {
    const apiKey = process.env.GEMINI_API_KEY;

    // Return cached result if still valid
    if (!forceRefresh && cachedResult && (Date.now() - lastValidation) < CACHE_TTL) {
        return cachedResult;
    }

    // No API key configured
    if (!apiKey) {
        cachedResult = {
            isValid: false,
            availableModels: [],
            preferredModel: null,
            error: "GEMINI_API_KEY not configured"
        };
        lastValidation = Date.now();
        return cachedResult;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url, {
            signal: AbortSignal.timeout(10000) // 10s timeout
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            cachedResult = {
                isValid: false,
                availableModels: [],
                preferredModel: null,
                error: `API Error: ${response.status} - ${errorData.error?.message || response.statusText}`
            };
            lastValidation = Date.now();
            return cachedResult;
        }

        const data = await response.json();
        const models: ModelInfo[] = (data.models || [])
            .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
            .map((m: any) => ({
                name: m.name.replace("models/", ""),
                displayName: m.displayName,
                supportsGenerate: true
            }));

        // Find the best available model from our preference list
        const modelNames = models.map(m => m.name);
        const preferredModel = PREFERRED_MODELS.find(pm => modelNames.includes(pm)) || modelNames[0] || null;

        cachedResult = {
            isValid: models.length > 0,
            availableModels: models,
            preferredModel,
            error: models.length === 0 ? "No compatible models found for this API key" : undefined
        };

        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Validator] ✅ Valid key. ${models.length} models available. Using: ${preferredModel}`);
        }

        lastValidation = Date.now();
        return cachedResult;

    } catch (error: any) {
        cachedResult = {
            isValid: false,
            availableModels: [],
            preferredModel: null,
            error: `Network error: ${error.message}`
        };
        lastValidation = Date.now();
        return cachedResult;
    }
}

/**
 * Quick check if AI is enabled and ready
 */
export async function isAiEnabled(): Promise<boolean> {
    const result = await validateApiKey();
    return result.isValid;
}

/**
 * Get the best available model name
 */
export async function getPreferredModel(): Promise<string | null> {
    const result = await validateApiKey();
    return result.preferredModel;
}

/**
 * Get cached result without network call (returns null if not validated yet)
 */
export function getCachedValidation(): ValidationResult | null {
    return cachedResult;
}
