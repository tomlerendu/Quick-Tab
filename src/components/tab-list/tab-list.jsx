import React from 'react';
import './tab-list.scss';
import PropTypes from 'prop-types';
import { Tab } from '../tab/tab';
import { Search } from '../search/search';

export class TabList extends React.Component {
  state = {
    tabs: [],
    currentlySelectedTab: null,
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

  render() {
    return (
      <div>
        <Search />
        { this.state.tabs.map(tab => {
          return <div key={ tab.id }
                      onClick={ () => this.props.browserProvider.switchToTab(tab) }
                      onMouseEnter={ () => this.mouseEnteredTab(tab) }>
            <Tab tab={ tab }
                 isSelected={ this.state.currentlySelectedTab === tab } />
          </div>
        }) }
      </div>
    );
  }
}

TabList.propTypes = {
  browserProvider: PropTypes.object,
};