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
    static toRoutes(mappers: RouteMapper[]): JSX.Element[] {
        return mappers.map(i => {
            if (i.protected) {
                return <Route key={Math.random()} path={i.path} element={
                    <AuthenticatorGuard element={<i.element/>} />
                }>
                    {
                        i.children ? 
                            AuthRouteMapper.toRoutes(i.children)
                            : undefined
                    }
                </Route>;
            }
            return <Route key={Math.random()} path={i.path} element={
                <PublicGuard element={<i.element/>}/>
            }>
                {
                    i.children ? 
                        AuthRouteMapper.toRoutes(i.children)
                        : undefined
                }
            </Route>;
        });
    }
}