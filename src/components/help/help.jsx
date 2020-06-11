import React from 'react';
import PropTypes from 'prop-types';

const Help = ({
  browserActionShortcut,
  onDismiss,
  onOptionsClick,
}) => <div className={ 'bg-green-200 p-4 text-green-900' }>
  <h2 className={ 'text-lg' }>
    Welcome to Quick Tab!
  </h2>
  <ul className={ 'my-4 list-desc text-xs text-green-900 ' }>
    { this.props.browserActionShortcut && <li className={ 'mb-1' }>
      Use { browserActionShortcut } to open this window quickly
    </li> }
    { !browserActionShortcut && <li className={ 'mb-1' }>
      You can configure a keyboard shortcut to open this window quickly in options
    </li> }
    <li className={ 'mb-1' }>
      Use the up, down and enter keys to select and switch to a tab
    </li>
    <li className={ 'mb-1' }>
      Right click on a tab to close it
    </li>
  </ul>
  <div className={ 'text-gray-800' }>
    <button
      className={ 'bg-white py-2 px-4 rounded hover:bg-gray-100' }
      onClick={ () => onDismiss() }
    >
      Ok, got it
    </button>
    <button
      className={ 'py-2 px-4 hover:underline' }
      onClick={ () => onOptionsClick() }
    >
      Options
    </button>
  </div>
</div>;

Help.propTypes = {
  browserActionShortcut: PropTypes.string,
  onDismiss: PropTypes.func,
  onOptionsClick: PropTypes.func,
};

export default Help;