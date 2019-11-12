import React from 'react';
import './tab-list.scss';
import PropTypes from 'prop-types';
import { Tab } from '../tab/tab';
import { Search } from '../search/search';

export class TabList extends React.Component {

  state = {
    tabs: [],
    currentlySelectedTab: null,
    searchTerm: '',
    searchFocused: true,
  };

  constructor(props) {
    super(props);

    props.browserProvider
      .getTabs()
      .then(tabs => this.setState({ tabs }))
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
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      this.handleArrowKeyPress(event.key);
    }

    if (event.key === 'Enter') {
      this.handleEnterKeyPress();
    }
  }

  handleArrowKeyPress(key) {
    let index = this.state.tabs.indexOf(this.state.currentlySelectedTab);

    if (['ArrowUp', 'ArrowLeft'].includes(key)) {
      index = Math.max(0, index - 1);
    }

    if (['ArrowDown', 'ArrowRight'].includes(key)) {
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
    this.setState({ searchTerm });
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
    return (
      <div>
        <Search searchTermUpdated={ searchTerm => this.handleSearchTermUpdate(searchTerm) }
                enterKeyPressed={ () => this.handleEnterKeyPress() } />
        { this.renderTabs() }
      </div>
    );
  }

  renderTabs() {
    let tabs = this.state.tabs;

    if (this.state.searchTerm !== '') {
      const searchTerm = this.state.searchTerm
        .replace(/  +/g, ' ')
        .split(' ')
        .join('.*?');

      const searchTermRegex = new RegExp(`(${ searchTerm })`, 'gi');

      tabs = tabs.filter(tab => tab.title.match(searchTermRegex));
    }

    if (tabs.length === 0) {
      return this.renderNoTabsFound();
    }

    return tabs.map(tab => {
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
    return <div className="p-4">
      <p>
        <span role="img" aria-label="Shocked face emoji">😱</span>
      </p>
      <p>No tabs found</p>
    </div>
  }

}

TabList.propTypes = {
  browserProvider: PropTypes.object,
};