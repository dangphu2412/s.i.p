export interface IAuthConfig {
    redirectRoute: string;
    authKey: string;
}

export enum AuthConfigKeys {
    AUTH_KEY_KEY,
    REDIRECT_ROUTE_KEY
}

export class AuthConfig {
    private static store = new Map();

    public static config(config: IAuthConfig) {
        Object.values(config).forEach(i => {
            if (typeof i !== 'string') {
                throw new Error('Values of auth config need to be string');
            }
        });
        AuthConfig.store.set(AuthConfigKeys.AUTH_KEY_KEY, config.authKey);
        AuthConfig.store.set(AuthConfigKeys.REDIRECT_ROUTE_KEY, config.redirectRoute);
    }

    public static get(key: AuthConfigKeys): string {
        if (!AuthConfig.store.has(key)) {
            throw new Error(`${key} is not existing in auth config`);
        }
        return AuthConfig.store.get(key);
    }
}