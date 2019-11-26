import React from 'react';
import './tab-list.scss';
import PropTypes from 'prop-types';
import { Tab } from '../tab/tab';
import { Search } from '../search/search';

const emptyTabScreenActions = {
  newTab: 'newTab',
  search: 'search',
};

export class TabList extends React.Component {

  state = {
    searchTerm: '',
    filteredTabs: [...this.props.tabs],
    selectedTab: null,
    selectedEmptyTabScreenAction: emptyTabScreenActions.newTab,
  };

  mouseEnteredTab(tab) {
    this.setState({
      selectedTab: tab,
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress.bind(this));
  }

  width() {
    return {
      small: 350,
      medium: 450,
      large: 550,
      gigantic: 700,
    }[this.props.options.width] + 'px';
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
    let index = this.props.tabs.indexOf(this.state.selectedTab);

    if (key === 'ArrowUp') {
      index = Math.max(0, index - 1);
    }

    if (key === 'ArrowDown') {
      index = Math.min(this.props.tabs.length - 1, index + 1);
    }

    this.setState({
      selectedTab: this.props.tabs[index],
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

  handleSearchTermUpdate(searchTerm) {
    let filteredTabs;

    if (searchTerm !== '') {
      const regexSearchTerm = searchTerm
        .replace(/  +/g, ' ')
        .split(' ')
        .join('.*?')
        .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

      const searchTermRegex = new RegExp(`(${ regexSearchTerm })`, 'gi');

      filteredTabs = this.props.tabs.filter(tab => tab.title.match(searchTermRegex));
    } else {
      filteredTabs = [...this.props.tabs];
    }

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

    this.setState({
      tabs: this.props.tabs.filter(t => t !== tab),
      filteredTabs: this.props.tabs.filter(t => t !== tab),
    });
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
      <div style={ { width: this.width() } }>
        <Search searchTermUpdated={ searchTerm => this.handleSearchTermUpdate(searchTerm) } />
        { this.renderTabs() }
      </div>
    );
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
  switchToTab: PropTypes.func,
  closeTab: PropTypes.func,
  openNewTabPage: PropTypes.func,
  createTab: PropTypes.func,
};