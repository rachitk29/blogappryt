import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Automatically log in after creating account
                return this.login({ email, password });
            }
            return userAccount;
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // Automatically ensures a session exists (guest or logged-in)
    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user; // logged-in user
        } catch (error) {
            // If no logged-in user, create an anonymous session
            if (error.code === 401) {
                try {
                    await this.account.createAnonymousSession();
                    return await this.account.get(); // guest user
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
