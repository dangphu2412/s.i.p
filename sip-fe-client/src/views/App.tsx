import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { registerErrors } from 'src/modules/http/http-request';
import { configApp } from '../config/app.config';
import '../index.scss';
import { AuthRouteMapper } from '../modules/auth/auth-route.adapter';
import { AuthRestoreGuard } from '../modules/auth/guards/restore-guard';
import { LoginSuccessPage } from '../modules/auth/pages/LoginSuccessPage';
import '../scss/global.scss';
import { UnAuthenticatePage } from './auth/UnAuthenticatePage';
import { CreateDiscussionPage } from './dicussion/CreateDicussionPage';
import { DiscussionOverviewPage } from './dicussion/DicussionOverviewPage';
import { DiscussionDetailPage } from './dicussion/DiscussionDetailPage';
import { EditDiscussionPage } from './dicussion/EditDiscussionPage';
import { NotFoundPage } from './not-found/NotFoundPage';
import { CreateDetailPostPage } from './post/UpdateDetailPostPage';
import { CreatePostPage } from './post/CreatePostPage';
import { HomePage } from './post/HomePage';
import { IdeaOverviewPage } from './post/IdeaOverviewPage';
import { PostDetailPage } from './post/PostDetailPage';
import { TopicDetailPage } from './topic/TopicDetailPage';
import { TopicOverviewPage } from './topic/TopicOverviewPage';
import { Products } from './user/Products';
import { Profile } from './user/Profile';
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
                            { path: '/posts/edit/:slug', element: CreateDetailPostPage, protected: true },
                            { path: '/posts/new', element: CreatePostPage, protected: true },
                            { path: '/topics/:slug', element: TopicDetailPage },
                            { path: '/topics', element: TopicOverviewPage },
                            { path: '/discussions', element: DiscussionOverviewPage },
                            { path: '/discussions/:slug', element: DiscussionDetailPage },
                            { path: '/discussions/new', element: CreateDiscussionPage, protected: true },
                            { path: '/discussions/:slug/edit', element: EditDiscussionPage, protected: true },
                            { path: '/sipers/:hashTag', element: Profile, protected: true },
                            { path: '/me/products', element: Products, protected: true },
                            { path: '/settings', element: Settings, protected: true },
                            { path: '/forbidden', element: UnAuthenticatePage },
                            { path: '/ideas', element: IdeaOverviewPage },
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
