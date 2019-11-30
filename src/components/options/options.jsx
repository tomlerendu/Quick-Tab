import React from 'react';
import './options.scss';
import PropTypes from 'prop-types';
import embeddedInOptionsProvider from '../../browser-providers/embedded-in-options';
import chromeProvider from '../../browser-providers/chrome';
import { OptionGroup } from '../options-group/option-group';
import * as options from '../../providers/options';
import { OptionsTabContainer } from '../options-tab-container/options-tab-container';

export class Options extends React.Component {

  browserActionShortcutIntervalId = null;

  state = {
    options: {},
    browserActionShortcut: null,
  };

  constructor(props) {
    super(props);

    props.browserProvider
      .getOptions(options.defaults)
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

  handleUrlClicked(url) {
    this.props.browserProvider.createTab(url);
  }

  render() {
    return (
      <div className={ 'flex m-5 text-gray-800 container' }>
        <div className={ 'w-3/5' }>
          <div className={ 'mb-4' }>
            <h2 className={ 'text-lg my-2' }>Shortcut</h2>
            <p>
              { this.state.browserActionShortcut
                ? <span className={ 'pr-2' }>Open Quick Tab using <strong>{ this.state.browserActionShortcut }</strong></span>
                : <span className={ 'pr-2' }>No shortcut configured to open Quick Tab</span>
              }
              —
              <a className={ 'text-blue-700 ml-2 cursor-pointer hover:underline' }
                 onClick={ () => this.handleConfigureBrowserActionShortcutClicked() }>
                Configure
              </a>
            </p>
          </div>
          <OptionGroup title={ 'Show Tabs From' }
                       options={ options.showTabsFrom }
                       value={ this.state.options.showTabsFrom }
                       valueUpdated={ value => this.handleOptionUpdated('showTabsFrom', value) } />
          <OptionGroup title={ 'Display Density' }
                       options={ options.displayDensity }
                       value={ this.state.options.displayDensity }
                       valueUpdated={ value => this.handleOptionUpdated('displayDensity', value) } />
          <OptionGroup title={ 'Width' }
                       options={ options.width }
                       value={ this.state.options.width }
                       valueUpdated={ value => this.handleOptionUpdated('width', value) } />
          <div className={ 'mb-4' }>
            <h2 className={ 'text-lg my-2' }>About</h2>
            <p>
              <span className={ 'pr-2' }>Feature requests and bugs</span>
              —
              <a className={ 'text-blue-700 ml-2 cursor-pointer hover:underline' }
                 onClick={ () => this.handleUrlClicked('https://github.com/tomlerendu/Quick-Tab/issues/new') }>
                Create Issue
              </a>
            </p>
            <p>
              <span className={ 'pr-2' }>Translations</span>
              —
              <a className={ 'text-blue-700 ml-2 cursor-pointer hover:underline' }
                 onClick={ () => this.handleUrlClicked('https://docs.google.com/forms/d/e/1FAIpQLSeNHnP0xeGR-pRixEk5K-8YhNDlsyDITXBhgOiE19cvt5_OAQ/viewform') }>
                Help Translate
              </a>
            </p>
          </div>
        </div>
        <div className={ 'flex w-2/5 p-6' }>
          <div className={ 'border border-gray-400 align-baseline w-full' }>
            <OptionsTabContainer browserProvider={ chromeProvider }
                                 optionsProvider={ embeddedInOptionsProvider }
                                 options={ this.state.options } />
          </div>
        </div>
      </div>
    );
  }

}

Options.propTypes = {
  browserProvider: PropTypes.object,
};