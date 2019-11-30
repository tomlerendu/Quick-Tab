import React from 'react';
import PropTypes from 'prop-types';
import { TabList } from '../tab-list/tab-list';

export class OptionsTabContainer extends React.Component {

  state = {
    isReady: false,
    tabs: null,
  };

  constructor(props) {
    super(props);

    props.optionsProvider.getTabs()
      .then(tabs => {
        this.setState({
          tabs,
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
               options={ this.props.options }
               saveOptions={ this.props.browserProvider.saveOptions }
               getOptions={ this.props.browserProvider.getOptions }
               getBrowserActionShortcut={ this.props.browserProvider.getBrowserActionShortcut }
               switchToTab={ this.props.optionsProvider.doNothing }
               openNewTabPage={ this.props.optionsProvider.doNothing }
               openOptionsPage={ this.props.optionsProvider.doNothing }
               createTab={ this.props.optionsProvider.doNothing }
               closeTab={ this.props.optionsProvider.doNothing } />
    );
  }

}

OptionsTabContainer.propTypes = {
  browserProvider: PropTypes.object,
  optionsProvider: PropTypes.object,
  options: PropTypes.object,
};