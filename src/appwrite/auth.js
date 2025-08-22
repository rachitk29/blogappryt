import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)          // e.g., "https://fra.cloud.appwrite.io/v1"
            .setProject(conf.appwriteProjectId);    // your project ID
        this.account = new Account(this.client);
    }

    // Create new user and auto-login
    async createAccount({ email, password, name }) {
        try {
            // v18 uses object parameters
            const userAccount = await this.account.create({
                userId: ID.unique(),
                email,
                password,
                name
            });

            if (userAccount) {
                return this.login({ email, password });
            }

            return userAccount;
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login({ email, password }) {
        try {
            return await this.account.createEmailSession({ email, password });
        } catch (error) {
            throw error;
        }
    }

    // Get current logged-in user
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            // If user is guest / no session exists, create anonymous session
            if (error.code === 401) {
                try {
                    await this.account.createAnonymousSession();
                    return await this.account.get();
                } catch (anonError) {
                    console.error("Failed to create anonymous session", anonError);
                    return null;
                }
            } else {
                console.error("Appwrite service :: getCurrentUser :: error", error);
                return null;
            }
        }
    }

    // Logout user
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();
export default authService;
