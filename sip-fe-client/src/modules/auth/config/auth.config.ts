export interface IAuthConfig {
    redirectRoute: string;
    defaultRoute: string;
    authKey: string;
}

export enum AuthConfigKeys {
    AUTH_KEY_KEY,
    REDIRECT_ROUTE_KEY,
    DEFAULT_ROUTE_KEY,
    AUTH_STATE_KEY
}

export class AuthConfig {
    private static store = new Map();

    public static config(config: IAuthConfig): void {
        Object.values(config).forEach(i => {
            if (typeof i !== 'string') {
                throw new Error('Values of auth config need to be string');
            }
        });
        AuthConfig.store.set(AuthConfigKeys.AUTH_KEY_KEY, config.authKey);
        AuthConfig.store.set(AuthConfigKeys.REDIRECT_ROUTE_KEY, config.redirectRoute);
        AuthConfig.store.set(AuthConfigKeys.DEFAULT_ROUTE_KEY, config.defaultRoute);
        AuthConfig.store.set(AuthConfigKeys.AUTH_STATE_KEY, 'auth-state');
    }

    public static get(key: AuthConfigKeys): string {
        if (!AuthConfig.store.has(key)) {
            throw new Error(`${key} is not existing in auth config`);
        }
        return AuthConfig.store.get(key);
    }
}