import React from 'react';
import './search.scss';
import PropTypes from 'prop-types';

const Search = ({
  searchTermUpdated,
}) => <div className={ 'flex' }>
  <input
    className={ 'flex-1 p-4 text-xl outline-none bg-gray-100 border-gray-200 border-b' }
    type={ 'text' }
    placeholder={ 'Quick Tab' }
    autoFocus
    onKeyDown={ event => {
      if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
      }
    } }
    onInput={ event => searchTermUpdated(event.target.value) }
  />
</div>;

Search.propTypes = {
  searchTermUpdated: PropTypes.func,
  enterKeyPressed: PropTypes.func,
};

export default Search;