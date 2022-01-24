import React from 'react';
import { Route } from 'react-router-dom';
import { AuthenticatorGuard } from './guards/authenticator.guard';
import { PublicGuard } from './guards/public.guard';

interface RouteMapper {
    path: string;
    element: () => JSX.Element;
    protected?: boolean;
    children?: RouteMapper[]
}

export class AuthRouteMapper {
    static toRoutes(mappers: RouteMapper[], options = { noPublicGuard: false }): JSX.Element[] {
        return mappers.map(mapper => {
            if (mapper.protected) {
                return <Route key={Math.random()} path={mapper.path} element={
                    <AuthenticatorGuard element={<mapper.element/>} />
                }>
                    {
                        mapper.children ? 
                            AuthRouteMapper.toRoutes(mapper.children, options)
                            : undefined
                    }
                </Route>;
            }
            return <Route key={Math.random()} path={mapper.path} element={
                options.noPublicGuard ? <mapper.element/>: <PublicGuard element={<mapper.element/>}/>
            }>
                {
                    mapper.children ? 
                        AuthRouteMapper.toRoutes(mapper.children, options)
                        : undefined
                }
            </Route>;
        });
    }
}