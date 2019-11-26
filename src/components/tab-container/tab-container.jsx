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

    props.browserProvider.getOptions(options.defaults)
      .then(options => {
        props.browserProvider.getTabs(options.showTabsFrom === 'current')
          .then(tabs => {
            this.setState({
              tabs,
              options,
              isReady: true,
            });
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
               openNewTabPage={ this.props.browserProvider.openNewTabPage }
               createTab={ this.props.browserProvider.createTab }
               closeTab={ this.props.browserProvider.closeTab } />
    );
  }

}

TabContainer.propTypes = {
  browserProvider: PropTypes.object,
};