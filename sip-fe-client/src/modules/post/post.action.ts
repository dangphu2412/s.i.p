import { Query } from './../query/interface';
import { createAction } from '@reduxjs/toolkit';

export const fetchPosts = createAction<Query>('POST/FETCH');