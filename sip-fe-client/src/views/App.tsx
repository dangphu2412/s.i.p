import React from 'react';
import '../index.scss';
import 'antd/dist/antd.css';
import '../scss/global.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configApp } from '../config/app.config';
import { AuthRouteMapper } from '../modules/auth/auth-route.adapter';
import { AuthRestoreGuard } from '../modules/auth/guards/restore-guard';
import { LoginSuccessPage } from '../modules/auth/pages/LoginSuccessPage';
import { HomePage } from './post/HomePage';
import { NotFoundPage } from './not-found/NotFoundPage';
import { PostDetailPage } from './post/PostDetailPage';
import { CreatePostPage } from './post/CreatePostPage';
import { TopicDetailPage } from './topic/TopicDetailPage';
import { TopicOverviewPage } from './topic/TopicOverviewPage';
import { CreateDetailPostPage } from './post/CreateDetailPostPage';
import { registerErrors } from 'src/modules/http/http-request';
import { Profile } from './user/Profile';
import { Products } from './user/Products';
import { Settings } from './user/Settings';

configApp();

function App(): JSX.Element {
    registerErrors({});
    return <>
        <AuthRestoreGuard>
            <BrowserRouter>
                <Routes>
                    {
                        AuthRouteMapper.toRoutes([
                            { path: '/success', element: LoginSuccessPage },
                            { path: '/posts/:slug', element: PostDetailPage },
                            { path: '/posts/new/:slug', element: CreateDetailPostPage, protected: true },
                            { path: '/posts/new', element: CreatePostPage, protected: true },
                            { path: '/topics', element: TopicOverviewPage,
                                children: [
                                    { path: '/topics/:slug', element: TopicDetailPage }
                                ] 
                            },
                            { path: '/sipers/:slug', element: Profile, protected: true },
                            { path: '/me/products', element: Products, protected: true },
                            { path: '/settings', element: Settings, protected: true },
                            { path: '/', element: HomePage }
                        ], {
                            noPublicGuard: true
                        })
                    }
                    {/* TODO: Integrate into auth modules */}
                    <Route path='*' element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        </AuthRestoreGuard>
    </>;
}

export default App;
