import React from 'react';
import './tab.scss';
import PropTypes from 'prop-types';

export class Tab extends React.Component {

  render() {
    return (
      <div className={ `flex p-4 cursor-pointer ${ this.props.isSelected ? 'bg-blue-100' : '' }` }>
        <div className={ 'w-px-16' }>
          { this.renderFavIcon() }
        </div>
        <div className={ 'w-auto' }>{ this.props.tab.title }</div>
      </div>
    );
  }

  renderFavIcon() {
    const invalidFavIconUrls = [
      undefined,
      null,
      '',
      'chrome://theme/IDR_EXTENSIONS_FAVICON',
      'chrome://theme/IDR_EXTENSIONS_FAVICON@2x',
    ];

    const url = invalidFavIconUrls.includes(this.props.tab.favIconUrl)
      ? 'images/blank.png'
      : this.props.tab.favIconUrl;

    return <img className={ 'w-px-16' }
                src={ url }
                alt={ `${ this.props.tab.title }  Icon` } />;
  }

}

Tab.propTypes = {
  tab: PropTypes.object,
  isSelected: PropTypes.bool,
};