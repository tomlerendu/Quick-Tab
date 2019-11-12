import React from 'react';
import './search.scss';
import PropTypes from 'prop-types';

export class Search extends React.Component {

  handleKeyPress(event) {
    event.key === 'Enter'
      ? this.props.enterKeyPressed()
      : this.props.searchTermUpdated(event.target.value);
  }

  render() {
    return (
      <div className="flex">
        <input className="flex-1 p-4 outline-none"
               type="text"
               placeholder="Quick Tab"
               autoFocus
               onKeyUp={ event => this.handleKeyPress(event) }/>
      </div>
    );
  }

}

Search.propTypes = {
  searchTermUpdated: PropTypes.func,
  enterKeyPressed: PropTypes.func,
};