import React from 'react';
import './tab-list.scss';
import PropTypes from 'prop-types';
import Tab from '../tab/tab';
import Search from '../search/search';
import Help from '../help/help';
import fuzzysort from 'fuzzysort';

const emptyTabScreenActions = {
  newTab: 'newTab',
  search: 'search',
};

export class TabList extends React.Component {

  state = {
    searchTerm: '',
    tabs: [...this.props.tabs],
    filteredTabs: [...this.props.tabs],
    selectedTab: null,
    browserActionShortcut: null,
    helpDismissed: true,
    selectedEmptyTabScreenAction: emptyTabScreenActions.newTab,
  };

  mouseEnteredTab(tab) {
    this.setState({
      selectedTab: tab,
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', event => this.handleKeyPress(event));

    this.props.getBrowserActionShortcut().then(
      browserActionShortcut => this.setState({ browserActionShortcut })
    );

    this.props
      .getOptions({ helpDismissed: false })
      .then(options => this.setState(options));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', event => this.handleKeyPress(event));
  }

  handleKeyPress(event) {
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      this.handleArrowKeyPress(event.key);
    }

    if (event.key === 'Enter') {
      this.handleEnterKeyPress();
    }
  }

  handleArrowKeyPress(key) {
    this.state.filteredTabs.length
      ? this.handleArrowKeyPressTabs(key)
      : this.handleArrowKeyPressEmpty(key);
  }

  handleArrowKeyPressTabs(key) {
    let index = this.state.filteredTabs.indexOf(this.state.selectedTab);

    if (key === 'ArrowUp') {
      index = Math.max(0, index - 1);
    }

    if (key === 'ArrowDown') {
      index = Math.min(this.state.filteredTabs.length - 1, index + 1);
    }

    this.setState({
      selectedTab: this.state.filteredTabs[index],
    });
  }

  handleArrowKeyPressEmpty(key) {
    let action = this.state.selectedEmptyTabScreenAction;

    if (key === 'ArrowUp' && this.state.selectedEmptyTabScreenAction === emptyTabScreenActions.search) {
      action = emptyTabScreenActions.newTab;
    }

    if (key === 'ArrowDown' && this.state.selectedEmptyTabScreenAction === emptyTabScreenActions.newTab) {
      action = emptyTabScreenActions.search;
    }

    this.setState({
      selectedEmptyTabScreenAction: action,
    });
  }

  handleEnterKeyPress() {
    this.state.filteredTabs.length
      ? this.props.switchToTab(this.state.selectedTab)
      : this.performSelectedEmptyTabAction();
  }

  handleOptionsClick() {
    this.props.openOptionsPage();
  }

  handleSearchTermUpdate(searchTerm) {
    const filteredTabs = searchTerm !== ''
      ? fuzzysort
        .go(searchTerm, this.state.tabs, { key: 'title', allowTypo: true, threshold: -Infinity })
        .map(result => result.obj)
      : [...this.state.tabs];

    this.setState({
      searchTerm,
      filteredTabs,
      selectedTab: filteredTabs.length && searchTerm.length
        ? filteredTabs[0]
        : null,
      selectedEmptyTabScreenAction: emptyTabScreenActions.newTab,
    });
  }

  handleTabClick(tab) {
    this.props.switchToTab(tab);
  }

  handleTabContextMenuClick(event, tab) {
    event.preventDefault();

    this.props.closeTab(tab);

    const currentTabs = this.state.searchTerm.length
      ? this.state.filteredTabs
      : this.state.tabs;

    const selectedTabIndex = currentTabs.indexOf(tab);

    this.setState({
      tabs: this.state.tabs.filter(t => t !== tab),
      filteredTabs: this.state.filteredTabs.filter(t => t !== tab),
      selectedTab: currentTabs[selectedTabIndex + 1] || null,
    });
  }

  handleHelpDismissed() {
    this.props.saveOptions({ helpDismissed: true });
    this.setState({ helpDismissed: true });
  }

  performSelectedEmptyTabAction() {
    if (this.state.selectedEmptyTabScreenAction === emptyTabScreenActions.newTab) {
      this.props.openNewTabPage();
    }

    if (this.state.selectedEmptyTabScreenAction === emptyTabScreenActions.search) {
      this.props.createTab(`https://google.com/search?q=${ encodeURIComponent(this.state.searchTerm) }`);
    }
  }

  setSelectedEmptyTabAction(action) {
    this.setState({
      selectedEmptyTabScreenAction: action,
    });
  }

  render() {
    return (
      <div className={ 'w-full' }>
        <Search searchTermUpdated={ searchTerm => this.handleSearchTermUpdate(searchTerm) } />
        { this.renderHelp() }
        { this.renderTabs() }
      </div>
    );
  }

  renderHelp() {
    if (this.state.helpDismissed) {
      return null;
    }

    return <Help browserActionShortcut={ this.state.browserActionShortcut }
                 onDismiss={ () => this.handleHelpDismissed() }
                 onOptionsClick={ () => this.handleOptionsClick() } />;
  }

  renderTabs() {
    if (this.state.filteredTabs.length === 0) {
      return this.renderEmptyTabScreen();
    }

    return this.state.filteredTabs.map(tab => {
      return <div key={ tab.id }
                  onClick={ () => this.handleTabClick(tab) }
                  onContextMenu={ event => this.handleTabContextMenuClick(event, tab) }
                  onMouseEnter={ () => this.mouseEnteredTab(tab) }>
        <Tab tab={ tab }
             isSelected={ this.state.selectedTab === tab }
             displayDensity={ this.props.options.displayDensity } />
      </div>
    });
  }

  renderEmptyTabScreen() {
    return <div className={ 'py-8 text-center' }>
      <p className={ 'text-xl py-4 text-gray-500' }>
        <span role={ 'img' } aria-label={ 'Shocked face emoji' }>😱</span> Nothing found
      </p>
      <div className={ 'flex justify-center text-gray-700' }>
        <ul className={ 'w-2/3 border border-gray rounded' }>
          <li
            onMouseEnter={ () => this.setSelectedEmptyTabAction(emptyTabScreenActions.newTab) }
            onClick={ () => this.performSelectedEmptyTabAction() }
            className={ `
              cursor-pointer p-2 text-base
              ${ this.state.selectedEmptyTabScreenAction === emptyTabScreenActions.newTab ? 'bg-blue-100' : '' }
            ` }
          >
            Open a new tab
          </li>
          <li
            onMouseEnter={ () => this.setSelectedEmptyTabAction(emptyTabScreenActions.search) }
            onClick={ () => this.performSelectedEmptyTabAction() }
            className={ `
              cursor-pointer p-2 text-base
              ${ this.state.selectedEmptyTabScreenAction === emptyTabScreenActions.search ? 'bg-blue-100' : '' }
            ` }
          >
            Search on Google
          </li>
        </ul>
      </div>
    </div>
  }

}

TabList.propTypes = {
  tabs: PropTypes.array,
  options: PropTypes.object,
  getOptions: PropTypes.func,
  saveOptions: PropTypes.func,
  switchToTab: PropTypes.func,
  closeTab: PropTypes.func,
  openNewTabPage: PropTypes.func,
  openOptionsPage: PropTypes.func,
  createTab: PropTypes.func,
  getBrowserActionShortcut: PropTypes.func,
};