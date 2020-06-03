import React from 'react';
import ReactDOM from 'react-dom';
import {ConfigProvider } from 'antd'
import zh from 'antd/es/locale/zh_CN'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import moment from 'moment';
import 'moment/locale/zh-cn';
const config={
    locale:zh
}
ReactDOM.render(
    <ConfigProvider {...config}>
        <App />
    </ConfigProvider>

,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
