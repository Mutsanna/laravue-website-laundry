import axios from 'axios';
import store from './store.js' //IMPORT BAGIAN INI

const $axios = axios.create({
    baseURL: '/api',
    headers: {
        // MATIKAN BAGIAN INI
        // Authorization: localStorage.getItem('token') != 'null' ? 'Bearer ' + localStorage.getItem('token'):'',
        'Content-Type': 'application/json'
    }
});

//KONFIGURASINYA KITA PINDAHKAN MENGGUNAKAN INTERCEPTORS
$axios.interceptors.request.use (
    function (config) {
        const token = store.state.token
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function (error) {
        return Promise.reject (error);
    }
);

export default $axios;