import React from 'react';
import './tab.scss';
import PropTypes from 'prop-types';

export class Tab extends React.Component {
  render() {
    return (
      <div className={ `flex p-2 cursor-pointer ${ this.props.selected ? 'bg-blue-100' : '' }` }>
        <div className={ 'w-16' }>
          <img className={ 'w-16' } src={ this.props.tab.favIconUrl }/>
        </div>
        <div className={ 'w-auto' }>{ this.props.tab.title }</div>
      </div>
    );
  }
}

Tab.propTypes = {
  tab: PropTypes.object,
  selected: PropTypes.bool,
};