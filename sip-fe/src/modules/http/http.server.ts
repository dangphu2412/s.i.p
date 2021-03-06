import axios from 'axios';
import { AuthConfig, AuthConfigKeys } from '../auth/config/auth.config';

export interface InitialHttpConfig {
    baseUrl: string;
}

export class HttpServer {
    private static server: HttpServer;

    public static config(config: InitialHttpConfig) {
        axios.defaults.baseURL = config.baseUrl;
        axios.defaults.headers.common['Authorization'] = window.localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY)) || '';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    public static getServer(): HttpServer {
        if (!HttpServer.server) {
            HttpServer.server = new HttpServer();
        }
        return HttpServer.server;
    }

    public async doPost(url: string, data: unknown, params?: unknown) {
        try {
            const response = await axios.post(url, JSON.stringify(data), { params });
            return response;
        } catch (error) {
            return error;
        }
    }

    
    public async doGet(url: string, params?: unknown) {
        try {
            const response = await axios.get(url, { params });
            return response;
        } catch (error) {
            return error;
        }
    }

    
    public async doPut(url: string,  data: unknown, params?: unknown) {
        try {
            const response = await axios.post(url, JSON.stringify(data), { params });
            return response;
        } catch (error) {
            return error;
        }
    }

    
    public async doDelete(url: string, params?: unknown) {
        try {
            const response = await axios.delete(url, { params });
            return response;
        } catch (error) {
            return error;
        }
    }
}