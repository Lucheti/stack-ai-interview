import { getAuthHeaders } from '../requests/auth/getAuthHeaders';
import { getOrg } from '../requests/auth/getOrg';

/**
 * AuthorizationService
 * 
 * This service manages user authentication and authorization.
 * It handles the process of logging in, storing and retrieving auth headers,
 * and provides methods for authorizing user actions.
 * 
 * The service uses a singleton pattern to ensure a single instance is used throughout the application.
 * It interacts with the backend for authentication and stores the auth headers in local storage for persistence.
 */
export class AuthorizationService {
    private static instance: AuthorizationService;
    private authHeaders: { Authorization: string } | null = null;
    private orgId: string | null = null;

    private constructor() {
        this.loadAuthHeaders();
        this.loadOrgId();
    }

    /**
     * Gets the singleton instance of AuthorizationService.
     * @returns The AuthorizationService instance.
     */
    public static getInstance(): AuthorizationService {
        if (!AuthorizationService.instance) {
            AuthorizationService.instance = new AuthorizationService();
        }
        return AuthorizationService.instance;
    }

    /**
     * Gets the current authentication headers.
     * @returns The current authentication headers or null if not set.
     */
    public getAuthHeaders(): { Authorization: string } | null {
        return this.authHeaders;
    }

    /**
     * Gets the current organization ID.
     * @returns The current organization ID or null if not set.
     */
    public getOrgId(): string | null {
        return this.orgId;
    }

    /**
     * Checks if the user is currently logged in.
     * @returns True if the user is logged in, false otherwise.
     */
    public isLoggedIn(): boolean {
        return !!this.authHeaders && !!this.orgId;
    }

    /**
     * Loads the authentication headers from local storage.
     * This method is called during the initialization of the service.
     */
    private loadAuthHeaders(): void {
        if (typeof window !== 'undefined') {
            const storedHeaders = localStorage.getItem('authHeaders');
            if (storedHeaders) {
                this.authHeaders = JSON.parse(storedHeaders);
            }
        }
    }

    /**
     * Saves the authentication headers to local storage.
     * This method is called when the authentication headers are updated.
     */
    private saveAuthHeaders(): void {
        if (typeof window !== 'undefined' && this.authHeaders) {
            localStorage.setItem('authHeaders', JSON.stringify(this.authHeaders));
        }
    }

    /**
     * Saves the organization ID to local storage.
     */
    private saveOrgId(): void {
        if (typeof window !== 'undefined' && this.orgId) {
            localStorage.setItem('orgId', this.orgId);
        }
    }

    /**
     * Loads the organization ID from local storage.
     */
    private loadOrgId(): void {
        if (typeof window !== 'undefined') {
            const storedOrgId = localStorage.getItem('orgId');
            if (storedOrgId) {
                this.orgId = storedOrgId;
            }
        }
    }

    /**
     * Fetches authentication headers from the server.
     * @param email User's email
     * @param password User's password
     * @returns Promise resolving to authentication headers
     */
    private async fetchAuthHeaders(email: string, password: string): Promise<{ Authorization: string }> {
        if (this.authHeaders) return this.authHeaders;

        try {
            const headers = await getAuthHeaders(email, password);
            this.authHeaders = headers;
            this.saveAuthHeaders();
            return this.authHeaders;
        } catch (error) {
            console.error('Error getting auth headers:', error);
            throw error;
        }
    }

    /**
     * Fetches the organization ID from the server.
     * @returns Promise resolving to the organization ID
     */
    private async fetchOrg(): Promise<string> {
        if (this.orgId) return this.orgId;

        if (!this.authHeaders) throw new Error('Authentication headers not available');
        if (!process.env.NEXT_PUBLIC_BACKEND_URL) throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');

        try {
            const response = await getOrg();
            this.orgId = response.org_id;
            this.saveOrgId();
            return response.org_id;
        } catch (error) {
            console.error('Error getting organization:', error);
            throw error;
        }
    }

    /**
     * Authorizes the user and fetches necessary data.
     * @param email User's email
     * @param password User's password
     * @returns Promise resolving to auth headers and org ID
     */
    public async authorize(email: string, password: string): Promise<{ authHeaders: { Authorization: string }, orgId: string }> {
        try {
            const authHeaders = await this.fetchAuthHeaders(email, password);
            const orgId = await this.fetchOrg();
            return { authHeaders, orgId };
        } catch (error) {
            console.error('Authorization failed:', error);
            throw error;
        }
    }
}
