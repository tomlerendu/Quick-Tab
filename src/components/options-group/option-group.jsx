import React from 'react';
import './option-group.scss';
import PropTypes from 'prop-types';

export class OptionGroup extends React.Component {

  handleOptionChanged(event) {
    this.props.valueUpdated(event.target.value);
  }

  render() {
    return (
      <div className={ 'py-2' }>
        <h2 className={ 'text-lg my-2' }>{ this.props.title }</h2>
        { this.renderOptions() }
      </div>
    );
  }

  renderOptions() {
    return Object.keys(this.props.options).map(value => {
      return <div className={ 'bg-gray-100 inline-block border border-gray-400 hover:border-gray-500 mr-2' }
                  key={ `option-${this.props.title}-${ value }` }>
        <input type="radio"
               id={ `option-${this.props.title}-${ value }` }
               name={ `option-${this.props.title}`}
               value={ value }
               checked={ String(this.props.value) === String(value) }
               onChange={ event => this.handleOptionChanged(event) }
               className={ 'px-4 py-2 inline-block cursor-pointer' }/>
        <label className={ 'px-4 py-2 inline-block cursor-pointer' } htmlFor={ `option-${this.props.title}-${ value }` }>
          { this.props.options[value] }
        </label>
      </div>
    });
  }

}

OptionGroup.propTypes = {
  title: PropTypes.string,
  options: PropTypes.object,
  value: PropTypes.any,
  valueUpdated: PropTypes.func,
};