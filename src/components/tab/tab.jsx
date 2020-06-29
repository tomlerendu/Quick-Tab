import React, { useState } from 'react';
import './tab.scss';
import PropTypes from 'prop-types';
import * as options from '../../providers/options';

const Tab = ({
  isSelected,
  tab,
  displayDensity,
}) => {
  const [canLoadFavicon, setCanLoadFavicon] = useState(true);

  const yPadding = {
    default: 'py-3',
    comfortable: 'py-2',
    compact: 'py-1',
    squashed: '',
  }[displayDensity];

  const textSize = {
    default: 'text-base',
    comfortable: 'text-base',
    compact: 'text-sm',
    squashed: 'text-sm',
  }[displayDensity];

  const favIcon = () => {
    const invalidFavIconUrls = [
      undefined,
      null,
      '',
      'chrome://theme/IDR_EXTENSIONS_FAVICON',
      'chrome://theme/IDR_EXTENSIONS_FAVICON@2x',
    ];

    const url = invalidFavIconUrls.includes(tab.favIconUrl)
      ? 'images/blank.png'
      : tab.favIconUrl;

    return <img
      className={ 'tab-icon mr-4' }
      src={ canLoadFavicon ? url : 'images/blank.png' }
      alt={ `${ tab.title } Icon` }
      onError={ () => setCanLoadFavicon(false) }
    />;
  };

  return (
    <div
      className={ `flex items-center px-4 ${ yPadding } cursor-pointer ${ isSelected ? 'bg-blue-100' : '' }` }
    >
      { favIcon() }
      <div
        className={ `text-gray-900 ${ textSize } tab-title` }
      >
        { tab.title }
      </div>
    </div>
  );
};

Tab.propTypes = {
  tab: PropTypes.object,
  isSelected: PropTypes.bool,
  displayDensity: PropTypes.oneOf(Object.keys(options.displayDensity)),
};

export default Tab;