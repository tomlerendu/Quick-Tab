import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.css';
import chrome from './browser-providers/chrome';
import { Options } from './components/options/options';
import { TabContainer } from './components/tab-container/tab-container';

const tabContainer = document.getElementById('tab-container');
const options = document.getElementById('options');

tabContainer && ReactDOM.render(
  <TabContainer browserProvider={ chrome } />,
  tabContainer,
);

options && ReactDOM.render(
  <Options browserProvider={ chrome } />,
  options,
);