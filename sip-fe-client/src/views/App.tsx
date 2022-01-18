import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configApp } from '../config/app.config';
import { AuthRouteMapper } from '../modules/auth/auth-route.adapter';
import { AuthRestoreGuard } from '../modules/auth/guards/restore-guard';
import { LoginSuccessPage } from '../modules/auth/pages/LoginSuccessPage';
import { HomePage } from './home/HomePage';
import { NotFoundPage } from './not-found/NotFoundPage';
import { PostDetailPage } from './post/PostDetailPage';
import { CreatePostPage } from './post/CreatePostPage';
import { TopicDetailPage } from './topic/TopicDetailPage';
import { TopicOverviewPage } from './topic/TopicOverviewPage';

configApp();


function App(): JSX.Element {
    return <>
        <AuthRestoreGuard>
            <BrowserRouter>
                <Routes>
                    {
                        AuthRouteMapper.toRoutes([
                            { path: '/login/success', element: LoginSuccessPage },
                            { path: '/posts/:postId', element: PostDetailPage },
                            { path: '/posts/new', element: CreatePostPage },
                            { path: '/topics', element: TopicOverviewPage,
                                children: [
                                    { path: '/topics/:topicId', element: TopicDetailPage }
                                ] 
                            },
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
