'use client';

import { useState } from 'react';
import { FormTextField, CTA } from '../../components';

const FormAddTextField = ({
  emailAddressMapped = '',
  teammates,
  handleAddTeammate,
}) => {
  const [emailAddress, setEmailAddress] = useState('');

  const handleForm = (e) => {
    setEmailAddress({ ...form, [e.target.name]: e.target.value });

    /*  if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    } */
  };

  return (
    <div className='auth-form__form-add-text-field'>
      <div className='auth-form__form-add-text-field-field-wrapper'>
        <FormTextField
          label='Teammate Email Address'
          type='email'
          id='teammate'
          name='teammate'
          value={emailAddressMapped ? emailAddressMapped : emailAddress}
          onChangeHandler={(e) => setEmailAddress(e.target.value)}
          //errorMessage={errorMessage.teammate}
        />
      </div>
      <div className='auth-form__form-add-text-field-btn-wrapper'>
        <CTA
          text='Add'
          className='cta-button cta-button--medium cta-button--full cta-button--green'
          ariaLabel='Add Another Teammate'
          btnType='button'
          handleClick={() => {
            if (teammates?.length === 0) {
              handleAddTeammate((current) => {
                return {
                  ...current,
                  teammates: [emailAddress],
                };
              });
              setEmailAddress('');
            } else {
              handleAddTeammate((current) => {
                return {
                  ...current,
                  teammates: [...current.teammates, emailAddress],
                };
              });
              setEmailAddress('');
            }
          }}
        />
      </div>
    </div>
  );
};

export default FormAddTextField;
