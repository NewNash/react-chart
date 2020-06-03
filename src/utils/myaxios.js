import axios from 'axios'

const myaxios = axios.create({
    baseURL: 'http://192.168.0.50',
    timeout: 4000,
})
myaxios.interceptors.request.use((config) => {
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token')
        }
        return config
    }
)

myaxios.all = function (data) {
    return Promise.all(data);
};

myaxios.spread = function (callback) {
    return function (arg) {
        callback.apply(null, arg);
    }
};

myaxios.interceptors.response.use(res => {
    return res
})


export default myaxios
