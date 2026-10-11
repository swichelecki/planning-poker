'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { z } from 'zod';
import {
  FormTextField,
  FormAddLinkField,
  CTA,
  Tooltip,
} from '../../components';
import { useScrollToTop } from '../../hooks';
import { createRoomSchema, storyLinkSchema } from '../../schemas/schemas';
import { MdAddCircle } from 'react-icons/md';
import { BsQuestionCircleFill } from 'react-icons/bs';

const Toast = dynamic(() => import('../../components/shared/Toast'), {
  ssr: false,
});

const CreateRoom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  useScrollToTop();

  const roomEncoded = searchParams.get('room');
  const room = decodeURI(roomEncoded);
  const isNewInvite = !!searchParams?.get('invite');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    storyLinks: [],
  });
  const [errorMessage, setErrorMessage] = useState({
    firstName: '',
    lastName: '',
    storyLink: '',
  });
  const [isStepOne, setIsStepOne] = useState(true);
  const [storyLink, setStoryLink] = useState('');
  const [addStoryLinkAndEnterRoom, setAddStoryLinkAndEnterRoom] =
    useState(false);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  // Move to step 2
  const handleMoveToStepTwo = () => {
    const zodValidationResults = createRoomSchema.safeParse(form);
    const { success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { firstName, lastName } = properties;

      if (!firstName && !lastName) {
        const errorMsg = {
          status: 400,
          error: 'Zod validation failed. Check console.',
        };
        setShowToast(<Toast serverError={errorMsg} />);
        console.error(error);
        return;
      }

      return setErrorMessage({
        ...errorMessage,
        firstName: firstName?.errors[0],
        lastName: lastName?.errors[0],
      });
    }

    setIsStepOne(false);
  };

  // Join room when using invitation link
  const handleJoinRoom = () => {
    const zodValidationResults = createRoomSchema.safeParse(form);
    const { success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { firstName, lastName } = properties;

      if (!firstName && !lastName) {
        const errorMsg = {
          status: 400,
          error: 'Zod validation failed. Check console.',
        };
        setShowToast(<Toast serverError={errorMsg} />);
        console.error(error);
        return;
      }

      return setErrorMessage({
        ...errorMessage,
        firstName: firstName?.errors[0],
        lastName: lastName?.errors[0],
      });
    }

    sessionStorage.setItem('storyLinks', JSON.stringify(form.storyLinks));

    const params = new URLSearchParams();
    params.append('username', `${form.firstName} ${form.lastName}`);
    params.append('room', room);

    console.log(`/room?${params.toString()}`);

    router.push(`/room?${params.toString()}`);
  };

  // Add story link
  const handleAddStoryLink = () => {
    const zodValidationResults = storyLinkSchema.safeParse({
      storyLink,
    });
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { storyLink } = properties;

      if (!storyLink) {
        const errorMsg = {
          status: 400,
          error: 'Zod validation failed. Check console.',
        };
        setShowToast(<Toast serverError={errorMsg} />);
        console.error(error);
        return;
      }

      return setErrorMessage({
        ...errorMessage,
        storyLink: storyLink?.errors[0],
      });
    }

    setForm((current) => {
      return {
        ...current,
        storyLinks: [...current.storyLinks, zodFormData?.storyLink],
      };
    });
    setStoryLink('');
  };

  // When story link not yet in state and form is submitted, add to state and call handleChooseRoom on next render
  const handleAddStoryLinkAndEnterRoom = () => {
    const zodValidationResults = storyLinkSchema.safeParse({
      storyLink,
    });
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { storyLink } = properties;
      return setErrorMessage({
        ...errorMessage,
        storyLink: storyLink?.errors[0],
      });
    }

    setForm((current) => {
      return {
        ...current,
        storyLinks: [...current.storyLinks, zodFormData?.storyLink],
      };
    });
    setStoryLink('');
    setAddStoryLinkAndEnterRoom(true);
  };

  // Choose and join room
  const getRandom6DigitNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const handleChooseRoom = () => {
    // add story links to session storage if any
    sessionStorage.setItem('storyLinks', JSON.stringify(form.storyLinks));
    sessionStorage.setItem('isNewRoom', 'true');

    const params = new URLSearchParams();
    params.append('username', `${form.firstName} ${form.lastName}`);
    params.append('room', `room_${getRandom6DigitNumber()}`);

    router.push(`/room?${params.toString()}`);
  };

  // when story link not yet in state and form is submitted, add to state and call handleChooseRoom on next render
  useEffect(() => {
    if (addStoryLinkAndEnterRoom) handleChooseRoom();
  }, [addStoryLinkAndEnterRoom]);

  return (
    <div className='auth-form__form'>
      {/* step 1: enter name */}
      {isStepOne && (
        <>
          <FormTextField
            label='First Name'
            type='text'
            id='firstName'
            name='firstName'
            value={form?.firstName}
            onChangeHandler={handleForm}
            errorMessage={errorMessage.firstName}
          />
          <FormTextField
            label='Last Name'
            type='text'
            id='lastName'
            name='lastName'
            value={form?.lastName}
            onChangeHandler={handleForm}
            errorMessage={errorMessage.lastName}
          />
          <CTA
            text={!isNewInvite ? 'Next' : 'Enter Room'}
            className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
            ariaLabel='Enter name and move to next step'
            btnType='button'
            handleClick={() => {
              !isNewInvite ? handleMoveToStepTwo() : handleJoinRoom();
            }}
          />
        </>
      )}
      {/* step 2: create and enter room */}
      {!isStepOne && (
        <>
          <div className='auth-form__form-field-with-cta-wrapper'>
            <p>User Stories</p>
            <div className='auth-form__tooltip-wrapper'>
              <Tooltip icon={<BsQuestionCircleFill />}>
                <p className='auth-form__story-links-tooltip-message'>
                  Optional: As the facilitator of this meeting can queue user
                  stories by pasting urls from a project management platform
                  such as Jira.
                </p>
              </Tooltip>
            </div>
            {form?.storyLinks?.length > 0 &&
              form?.storyLinks?.map((item, index) => (
                <FormAddLinkField
                  key={`form-add-link-field__${index}`}
                  setForm={setForm}
                  storyLinkItem={item}
                />
              ))}
            <FormAddLinkField
              setForm={setForm}
              storyLink={storyLink}
              setStoryLink={setStoryLink}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
            <CTA
              icon={<MdAddCircle />}
              text='Add Another Story Link'
              className='cta-button cta-button--icon cta-button--icon-green'
              ariaLabel='Add user story link'
              btnType='button'
              handleClick={handleAddStoryLink}
            />
          </div>
          <CTA
            text='Create Room'
            className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
            ariaLabel='Create and enter Agile Story Planning Poker Room'
            btnType='button'
            handleClick={
              storyLink ? handleAddStoryLinkAndEnterRoom : handleChooseRoom
            }
          />
          {!isStepOne && (
            <CTA
              text='Go Back'
              className='cta-button cta-text-link--purple'
              ariaLabel='Go Back to Choose Room, Create Room or Invite to Room'
              btnType='button'
              handleClick={() => {
                setIsStepOne(true);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CreateRoom;
