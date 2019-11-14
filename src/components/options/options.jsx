import React from 'react';
import './options.scss';
import PropTypes from 'prop-types';
import { TabList } from '../tab-list/tab-list';
import embeddedInOptions from '../../browser-providers/embedded-in-options';
import {OptionGroup} from "../options-group/option-group";

export class Options extends React.Component {

  render() {
    return (
      <div className={ 'flex' }>
        <div className={ 'flex-1' }>
          <h1>Quick Tab</h1>
          <OptionGroup title={ 'Show Tabs From' }
                       options={ { current: 'The current window', all: 'All windows' } }
                       value={ 'current' } />
          <OptionGroup title={ 'Display Density' }
                       options={ { default: 'Default', comfortable: 'Comfortable', compact: 'Compact' } }
                       value={ 'current' } />
          <OptionGroup title={ 'Width' }
                       options={ { 200: 'Small', 300: 'Medium', 400 : 'Large', 500: 'Gigantic' } }
                       value={ 200 } />
          <OptionGroup title={ 'Height' }
                       options={ { 200: 'Small', 300: 'Medium', 400: 'Large', 600: 'Gigantic' } }
                       value={ 400 } />
        </div>
        <div className={ 'flex-1' }>
          <TabList browserProvider={ embeddedInOptions } />
        </div>
      </div>
    );
  }

}

Options.propTypes = {
  browserProvider: PropTypes.object,
};