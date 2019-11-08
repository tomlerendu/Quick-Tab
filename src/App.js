import React from 'react';
import { TabList } from "./components/tab-list/tab-list";
import chrome from './browser-providers/chrome';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <TabList browserProvider={ chrome }/>
      </div>
    );
  }
}
