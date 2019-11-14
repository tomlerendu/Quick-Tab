import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.css';
import chrome from './browser-providers/chrome';
import { TabList } from './components/tab-list/tab-list';

const tabList = document.getElementById('tab-list');
const options = document.getElementById('options');

if (tabList) {
  ReactDOM.render(
    <TabList browserProvider={ chrome } />,
    tabList
  );
}

if (options) {
  ReactDOM.render(
    <TabList browserProvider={ chrome } />,
    options
  );
}