import React from 'react';
import './options.scss';
import PropTypes from 'prop-types';
import { TabList } from '../tab-list/tab-list';
import embeddedInOptions from '../../browser-providers/embedded-in-options';
import { OptionGroup } from '../options-group/option-group';

export class Options extends React.Component {

  browserActionShortcutIntervalId = null;

  state = {
    options: {},
    browserActionShortcut: null,
  };

  constructor(props) {
    super(props);

    props.browserProvider
      .getOptions({
        showTabsFrom: 'all',
        displayDensity: 'comfortable',
        width: 350,
        height: 400,
      })
      .then(options => this.setState({ options }));
  }

  componentDidMount() {
    const checkBrowserActionShortcut = () => this.props.browserProvider
      .getBrowserActionShortcut()
      .then(browserActionShortcut => this.setState({ browserActionShortcut }));

    checkBrowserActionShortcut();

    this.browserActionShortcutIntervalId = setInterval(
      checkBrowserActionShortcut,
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.browserActionShortcutIntervalId)
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

  handleConfigureBrowserActionShortcutClicked() {
    this.props.browserProvider.openConfigureBrowserActionShortcut();
  }

  render() {
    return (
      <div className={ 'flex m-5 text-gray-800' } style={ {width: '800px'}}>
        <div className={ 'w-3/5' }>
          <div className={ 'py-2' }>
            <h2 className={ 'text-lg my-2' }>Shortcut</h2>
            <p>
              { this.state.browserActionShortcut
                ? <span className={ 'pr-2 '}>Open Quick Tab using <strong>{ this.state.browserActionShortcut }</strong></span>
                : <span className={ 'pr-2' }>No shortcut configured to open Quick Tab</span>
              }
              —
              <a className={ 'text-blue-700 pl-2 cursor-pointer hover:underline' } onClick={ () => this.handleConfigureBrowserActionShortcutClicked() }>
                Configure
              </a>
            </p>
          </div>
          <OptionGroup title={ 'Show Tabs From' }
                       options={ { current: 'The current window', all: 'All windows' } }
                       value={ this.state.options.showTabsFrom }
                       valueUpdated={ value => this.handleOptionUpdated('showTabsFrom', value) } />
          <OptionGroup title={ 'Display Density' }
                       options={ { default: 'Default', comfortable: 'Comfortable', compact: 'Compact' } }
                       value={ this.state.options.displayDensity }
                       valueUpdated={ value => this.handleOptionUpdated('displayDensity', value) } />
          <OptionGroup title={ 'Width' }
                       options={ { 250: 'Small', 350: 'Medium', 450: 'Large', 600: 'Gigantic' } }
                       value={ this.state.options.width }
                       valueUpdated={ value => this.handleOptionUpdated('width', value) } />
          <OptionGroup title={ 'Height' }
                       options={ { 300: 'Small', 400: 'Medium', 600: 'Large', 800: 'Gigantic' } }
                       value={ this.state.options.height }
                       valueUpdated={ value => this.handleOptionUpdated('height', value) } />
          <div className={ 'py-2' }>
            <h2 className={ 'text-lg my-2' }>About</h2>
            <p>Request features using the ??? page</p>
            <p>Translations</p>
          </div>
        </div>
        <div className={ 'w-2/5 border border-gray-400' }>
          <TabList browserProvider={ embeddedInOptions } />
        </div>
      </div>
    );
  }

}

Options.propTypes = {
  browserProvider: PropTypes.object,
};