'use client';

import { FormErrorMessage } from '../';

const FormTextField = ({
  label = '',
  subLabel = '',
  type,
  id,
  name,
  value,
  onChangeHandler,
  errorMessage,
  disabled = false,
  showSpinner = false,
}) => {
  return (
    <div className={`form-field${errorMessage ? ' form-field--error' : ''}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {subLabel && <p className='form-field__sublabel'>{subLabel}</p>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChangeHandler}
        disabled={disabled}
      />
      {errorMessage && <FormErrorMessage errorMessage={errorMessage} />}
      {showSpinner && <div className='loader'></div>}
    </div>
  );
};

export default FormTextField;
