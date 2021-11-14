import axios from 'axios';
import { REACT_APP_API_URL } from './constant.config';

export function configAxios() {
	axios.defaults.baseURL = REACT_APP_API_URL;
	axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('auth') ?? '';
	axios.defaults.headers.post['Content-Type'] = 'application/json';
}