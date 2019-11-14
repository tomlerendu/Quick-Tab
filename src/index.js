import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.css';
import chrome from './browser-providers/chrome';
import { TabList } from './components/tab-list/tab-list';
import { Options } from './components/options/options';

const tabList = document.getElementById('tab-list');
const options = document.getElementById('options');

tabList && ReactDOM.render(
  <TabList browserProvider={ chrome } />,
  tabList
);

options && ReactDOM.render(
  <Options browserProvider={ chrome } />,
  options
);