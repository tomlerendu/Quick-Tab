import React from 'react';
import PropTypes from 'prop-types';
import * as options from '../../providers/options';
import { TabList } from '../tab-list/tab-list';

export class TabContainer extends React.Component {

  state = {
    isReady: false,
    tabs: null,
    options: null,
  };

  constructor(props) {
    super(props);

    Promise.all([
      props.browserProvider.getTabs(),
      props.browserProvider.getOptions(options.defaults),
    ]).then( ([tabs, options]) => {
      this.setState({
        tabs,
        options,
        isReady: true,
      });
    });
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }

    return (
      <TabList tabs={ this.state.tabs }
               options={ this.state.options }
               switchToTab={ this.props.browserProvider.switchToTab }
               closeTab={ this.props.browserProvider.closeTab } />
    );
  }

}

TabContainer.propTypes = {
  browserProvider: PropTypes.object,
};