import React from 'react';
import './option-group.scss';
import PropTypes from 'prop-types';

export class OptionGroup extends React.Component {

  handleOptionChanged(event) {
    this.props.valueUpdated(event.target.value);
  }

  render() {
    return (
      <div className={ 'flex-col' }>
        <h2>{ this.props.title }</h2>
        { this.renderOptions() }
      </div>
    );
  }

  renderOptions() {
    return Object.keys(this.props.options).map(value => {
      return <div key={ `option-${this.props.title}-${ value }` }>
        <input type="radio"
               id={ `option-${this.props.title}-${ value }` }
               name={ `option-${this.props.title}`}
               value={ value }
               checked={ String(this.props.value) === String(value) }
               onChange={ event => this.handleOptionChanged(event) }/>
        <label htmlFor={ `option-${this.props.title}-${ value }` }>
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