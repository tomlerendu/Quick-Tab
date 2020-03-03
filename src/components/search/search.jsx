import React from 'react';
import './search.scss';
import PropTypes from 'prop-types';

export class Search extends React.Component {

  handleInput(event) {
    this.props.searchTermUpdated(event.target.value);
  }

  preventUpAndDownArrowPresses(event) {
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
    }
  }

  render() {
    return (
      <div className={ 'flex' }>
        <input
          className={ 'flex-1 p-4 text-xl outline-none bg-gray-100 border-gray-200 border-b' }
          type={ 'text' }
          placeholder={ 'Quick Tab' }
          autoFocus
          onKeyDown={ event => this.preventUpAndDownArrowPresses(event) }
          onInput={ event => this.handleInput(event) }
        />
      </div>
    );
  }

}

Search.propTypes = {
  searchTermUpdated: PropTypes.func,
  enterKeyPressed: PropTypes.func,
};