import React from 'react';
import './tab-list.scss';
import PropTypes from 'prop-types';
import { Tab } from '../tab/tab';
import { Search } from '../search/search';

export class TabList extends React.Component {

  state = {
    isReady: false,
    tabs: [],
    filteredTabs: [],
    currentlySelectedTab: null,
  };

  constructor(props) {
    super(props);

    props.browserProvider
      .getTabs()
      .then(tabs => this.setState({
        tabs,
        filteredTabs: [...tabs],
        isReady: true
      }));
  }

  mouseEnteredTab(tab) {
    this.setState({
      currentlySelectedTab: tab,
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress.bind(this));
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
    let index = this.state.tabs.indexOf(this.state.currentlySelectedTab);

    if (['ArrowUp'].includes(key)) {
      index = Math.max(0, index - 1);
    }

    if (['ArrowDown'].includes(key)) {
      index = Math.min(this.state.tabs.length - 1, index + 1);
    }

    this.setState({
      currentlySelectedTab: this.state.tabs[index],
    });
  }

  handleEnterKeyPress() {
    this.state.currentlySelectedTab
      ? this.props.browserProvider.switchToTab(this.state.currentlySelectedTab)
      : this.setState({ currentlySelectedTab: this.state.tabs[0] });
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

      filteredTabs = this.state.tabs.filter(tab => tab.title.match(searchTermRegex));
    } else {
      filteredTabs = [...this.state.tabs];
    }

    this.setState({
      filteredTabs,
      currentlySelectedTab: filteredTabs.length && searchTerm.length ? filteredTabs[0] : null,
    });
  }

  handleTabClick(tab) {
    this.props.browserProvider.switchToTab(tab);
  }

  handleTabContextMenuClick(event, tab) {
    event.preventDefault();

    this.props.browserProvider.closeTab(tab);

    console.log(this.state.tabs.indexOf(tab));
    this.setState({
      tabs: [
        ...this.state.tabs.splice(
          this.state.tabs.indexOf(tab),
          1
        ),
      ],
    });
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }

    return (
      <div>
        <Search searchTermUpdated={ searchTerm => this.handleSearchTermUpdate(searchTerm) } />
        { this.renderTabs() }
      </div>
    );
  }

  renderTabs() {
    if (this.state.filteredTabs.length === 0) {
      return this.renderNoTabsFound();
    }

    return this.state.filteredTabs.map(tab => {
      return <div key={ tab.id }
                  onClick={ () => this.handleTabClick(tab) }
                  onContextMenu={ event => this.handleTabContextMenuClick(event, tab) }
                  onMouseEnter={ () => this.mouseEnteredTab(tab) }>
        <Tab tab={ tab }
             isSelected={ this.state.currentlySelectedTab === tab } />
      </div>
    });
  }

  renderNoTabsFound() {
    return <div className={ 'py-12 text-center text-gray-600' }>
      <p className={ 'text-6xl' }>
        <span role={ 'img' } aria-label={ 'Shocked face emoji' }>😱</span>
      </p>
      <p className={ 'text-xl' }>No tabs found</p>
    </div>
  }

}

TabList.propTypes = {
  browserProvider: PropTypes.object,
};