import React from 'react';
import './search.scss';
import PropTypes from 'prop-types';

export class Search extends React.Component {
  render() {
    return (
      <div>
        <input type={ 'text' } placeholder={ 'Quick Tab' } />
      </div>
    );
  }
}

Search.propTypes = {
};