import React from 'react';
import { TabList } from './components/tab-list/tab-list';
import chrome from './browser-providers/chrome';

export default class extends React.Component {

  render() {
    return (
      <TabList browserProvider={ chrome } />
    );
  }

}
