import React from 'react';
import './tab-list.scss';
import PropTypes from 'prop-types';
import { Tab } from '../tab/tab';

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
    document.addEventListener('keydown', this.keyPressed.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPressed.bind(this));
  }

  keyPressed(event) {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }

    let index = this.state.tabs.indexOf(this.state.currentlySelectedTab);

    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) {
      index = Math.max(0, index - 1);
    }

    if (['ArrowDown', 'ArrowRight'].includes(event.key)) {
      index = Math.min(this.state.tabs.length - 1, index + 1);
    }

    this.setState({
      currentlySelectedTab: this.state.tabs[index],
    });
  }

  render() {
    return (
      <div>
        { this.state.tabs.map(tab => {
          return <Tab key={ tab.id }
                      tab={ tab }
                      selected={ this.state.currentlySelectedTab === tab }
                      onMouseEnter={ () => this.mouseEnteredTab(tab) }/>
        }) }
      </div>
    );
  }
}

TabList.propTypes = {
  browserProvider: PropTypes.object,
};