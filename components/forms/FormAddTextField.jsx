'use client';

import { FormTextField, CTA } from '../../components';
import { MdRemoveCircle } from 'react-icons/md';

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
      {emailAddressItem && (
        <div className='auth-form__form-add-text-field-btn-wrapper'>
          <CTA
            icon={<MdRemoveCircle />}
            className='cta-button cta-button--icon cta-button--icon-red'
            ariaLabel='Delete Teammate Email'
            btnType='button'
            handleClick={() => {
              handleDeleteTeammate(emailAddressItem);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FormAddTextField;
