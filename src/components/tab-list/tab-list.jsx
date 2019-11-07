import React from 'react';
import './tab-list.scss';
import PropTypes from 'prop-types';
import { Tab } from '../tab/tab';

export class TabList extends React.Component {
  render() {
    return (
      <>
        { this.props.tabs.map(tab => {
          console.log(tab);
          return <Tab key={ tab.id } tab={ tab }/>
        }) }
      </>
    );
  }
}

TabList.propTypes = {
  tabs: PropTypes.array,
};