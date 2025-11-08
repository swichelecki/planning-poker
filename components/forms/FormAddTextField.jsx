'use client';

import { FormTextField, CTA } from '../../components';

const FormAddTextField = ({
  setForm,
  emailAddress,
  emailAddressItem,
  setEmailAddress,
  errorMessage,
  setErrorMessage,
}) => {
  // handle adding teammate email
  const handleEmailAddress = (e) => {
    setEmailAddress(e.target.value);
    if (errorMessage['teammates']) {
      setErrorMessage({ ...errorMessage, teammates: '' });
    }
  };

  // delete teammate email
  const handleDeleteTeammate = (emailAddressItem) => {
    setForm((current) => {
      return {
        ...current,
        teammates: [
          ...current.teammates.filter((item) => item !== emailAddressItem),
        ],
      };
    });
  };

  return (
    <div className='auth-form__form-add-text-field'>
      <div className='auth-form__form-add-text-field-field-wrapper'>
        <FormTextField
          label='Teammate Email Address'
          type='email novalidate'
          id='teammate'
          name='teammates'
          disabled={emailAddressItem}
          value={emailAddressItem ? emailAddressItem : emailAddress}
          onChangeHandler={handleEmailAddress}
          errorMessage={errorMessage?.teammates}
        />
      </div>
      <div className='auth-form__form-add-text-field-btn-wrapper'>
        <CTA
          text='x'
          className='cta-button cta-button--small cta-button--red'
          ariaLabel='Delete Teammate Email'
          btnType='button'
          disabled={!emailAddressItem}
          handleClick={() => {
            handleDeleteTeammate(emailAddressItem);
          }}
        />
      </div>
    </div>
  );
};

export default FormAddTextField;
