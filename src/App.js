import React from 'react';
import { TabList } from "./components/tab-list/tab-list";

export default class extends React.Component {
  state = {
    tabs: [],
  };

  constructor(props) {
    super(props);

    chrome.tabs.query({}, tabs => this.setState({ tabs }));
  }

  render() {
    return (
      <div className="App">
        <TabList tabs={ this.state.tabs }/>
      </div>
    );
  }
}
