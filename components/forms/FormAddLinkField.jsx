'use client';

import { FormTextField, CTA } from '../../components';
import { MdRemoveCircle } from 'react-icons/md';

const FormAddLinkField = ({
  setForm,
  storyLink,
  storyLinkItem,
  setStoryLink,
  errorMessage,
  setErrorMessage,
}) => {
  // handle adding story link
  const handleStoryLink = (e) => {
    setStoryLink(e.target.value);
    if (errorMessage['storyLink']) {
      setErrorMessage({ ...errorMessage, storyLink: '' });
    }
  };

  // delete story link
  const handleDeleteStoryLink = (storyLinkItem) => {
    setForm((current) => {
      return {
        ...current,
        storyLinks: [
          ...current.storyLinks.filter((item) => {
            return item !== storyLinkItem;
          }),
        ],
      };
    });
  };

  return (
    <div className='auth-form__form-field-with-cta'>
      <FormTextField
        type='link novalidate'
        name='storyLink'
        disabled={storyLinkItem}
        value={storyLinkItem ? storyLinkItem : storyLink}
        onChangeHandler={handleStoryLink}
        errorMessage={errorMessage?.storyLink}
      />
      {storyLinkItem && (
        <CTA
          icon={<MdRemoveCircle />}
          className='cta-button cta-button--icon cta-button--icon-red'
          ariaLabel='Delete Story Link'
          btnType='button'
          handleClick={() => {
            handleDeleteStoryLink(storyLinkItem);
          }}
        />
      )}
    </div>
  );
};

export default FormAddLinkField;
