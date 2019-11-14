import React from 'react';
import './options.scss';
import PropTypes from 'prop-types';
import { TabList } from '../tab-list/tab-list';
import embeddedInOptions from '../../browser-providers/embedded-in-options';
import { OptionGroup } from '../options-group/option-group';

export class Options extends React.Component {

  state = {
    options: {}
  };

  constructor(props) {
    super(props);

    props.browserProvider.getOptions({
      showTabsFrom: 'all',
      displayDensity: 'comfortable',
      width: 350,
      height: 400,
    }).then(
      options => this.setState({ options })
    );
  }

  handleOptionUpdated(option, value) {
    this.props.browserProvider.saveOptions({
      [option]: value,
    });

    this.setState({
      options: {
        ...this.state.options,
        ...{ [option]: value },
      }
    });
  }

  render() {
    return (
      <div className={ 'flex' }>
        <div className={ 'flex-1' }>
          <h1>Quick Tab</h1>
          <OptionGroup title={ 'Show Tabs From' }
                       options={ { current: 'The current window', all: 'All windows' } }
                       value={ this.state.options.showTabsFrom }
                       valueUpdated={ value => this.handleOptionUpdated('showTabsFrom', value) }/>
          <OptionGroup title={ 'Display Density' }
                       options={ { default: 'Default', comfortable: 'Comfortable', compact: 'Compact' } }
                       value={ this.state.options.displayDensity }
                       valueUpdated={ value => this.handleOptionUpdated('displayDensity', value) }/>
          <OptionGroup title={ 'Width' }
                       options={ { 250: 'Small', 350: 'Medium', 450: 'Large', 600: 'Gigantic' } }
                       value={ this.state.options.width }
                       valueUpdated={ value => this.handleOptionUpdated('width', value) }/>
          <OptionGroup title={ 'Height' }
                       options={ { 300: 'Small', 400: 'Medium', 600: 'Large', 800: 'Gigantic' } }
                       value={ this.state.options.height }
                       valueUpdated={ value => this.handleOptionUpdated('height', value) }/>
        </div>
        <div className={ 'flex-1' }>
          <TabList browserProvider={ embeddedInOptions } />
        </div>
      </div>
    );
  }

}

Options.propTypes = {
  browserProvider: PropTypes.object,
};