import React from 'react';
import ReactDOM from 'react-dom';

import {  ConfigProvider } from "antd";
import App from './App';
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>

,
  document.getElementById('chartBox')
);
