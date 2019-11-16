import React from 'react';
import './tab.scss';
import PropTypes from 'prop-types';
import * as options from '../../providers/options';

export class Tab extends React.Component {

  yPadding() {
    return {
      default: 'py-3',
      comfortable: 'py-2',
      compact: 'py-1',
      squashed: '',
    }[this.props.displayDensity];
  }

  textSize() {
    return {
      default: 'text-base',
      comfortable: 'text-base',
      compact: 'text-sm',
      squashed: 'text-sm',
    }[this.props.displayDensity];
  }

  render() {
    return (
      <div className={ `flex items-center px-4 ${ this.yPadding() } cursor-pointer ${ this.props.isSelected ? 'bg-blue-100' : '' }` }>
        { this.renderFavIcon() }
        <div className={ `text-gray-900 ${ this.textSize() } tab-title` }>{ this.props.tab.title }</div>
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

    return <img className={ 'tab-icon mr-4' }
                src={ url }
                alt={ `${ this.props.tab.title }  Icon` } />;
  }

}

Tab.propTypes = {
  tab: PropTypes.object,
  isSelected: PropTypes.bool,
  displayDensity: PropTypes.oneOf(Object.keys(options.displayDensity)),
};