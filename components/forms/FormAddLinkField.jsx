'use client';

import { FormTextField, CTA } from '../../components';
import { MdRemoveCircle } from 'react-icons/md';

const FormAddLinkField = ({
  storyLinks,
  storyLink,
  storyLinkItem,
  setStoryLink,
  errorMessage,
  setErrorMessage,
  forceUpdate,
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
    for (let i = storyLinks.length - 1; i >= 0; i--) {
      if (storyLinks[i] === storyLinkItem) {
        storyLinks.splice(i, 1);
      }
    }
    forceUpdate();
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
