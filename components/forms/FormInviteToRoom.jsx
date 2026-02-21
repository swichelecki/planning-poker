'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { inviteToRoom } from '../../actions';
import { useAppContext } from '../../context';
import { FormSelectField, FormAddTextField, CTA } from '../../components';
import { z } from 'zod';
import { inviteToRoomSchema, emailAddressSchema } from '../../schemas/schemas';
import { MdAddCircle } from 'react-icons/md';

const Toast = dynamic(() => import('../../components/shared/Toast'), {
  ssr: false,
});

const FormInviteToRoom = ({
  form,
  setForm,
  handleFormSelectField,
  userRooms,
  errorMessage,
  setErrorMessage,
  isAwaitingResponse,
  setIsAwaitingResponse,
  emailAddress,
  setEmailAddress,
  setShowInviteTeammate,
}) => {
  const router = useRouter();
  const { setShowToast } = useAppContext();

  const [addTeammateAndInviteToRoom, setAddTeammateAndInviteToRoom] =
    useState(false);

  // when teammate email not yet in state and form is submitted, add to state and call handleInviteToRoom on next render
  useEffect(() => {
    if (addTeammateAndInviteToRoom) handleInviteToRoom();
  }, [addTeammateAndInviteToRoom]);

  // add teammate email
  const handleAddTeammate = () => {
    const zodValidationResults = emailAddressSchema.safeParse({
      email: emailAddress,
    });
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { email } = properties;
      return setErrorMessage({ ...errorMessage, teammates: email?.errors[0] });
    }

    setForm((current) => {
      return {
        ...current,
        teammates: [...current.teammates, zodFormData?.email],
      };
    });
    setEmailAddress('');
  };

  // when teammate email not yet in state and form is submitted, add to state and call handleInviteToRoom on next render
  const handleAddTeammateAndInviteToRoom = () => {
    const zodValidationResults = emailAddressSchema.safeParse({
      email: emailAddress,
    });
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { email } = properties;
      return setErrorMessage({ ...errorMessage, teammates: email?.errors[0] });
    }

    setForm((current) => {
      return {
        ...current,
        teammates: [...current.teammates, zodFormData?.email],
      };
    });
    setAddTeammateAndInviteToRoom(true);
  };

  // invite teammates to existing room
  const handleInviteToRoom = async () => {
    const zodValidationResults = inviteToRoomSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { teammates, selectedRoom } = properties;

      if (!teammates && !selectedRoom) {
        const serverError = {
          status: 400,
          error: 'Zod validation failed. Check console.',
        };
        setShowToast(<Toast serverError={serverError} />);
        console.error(error);
        return;
      }

      return setErrorMessage({
        ...errorMessage,
        selectedRoom: selectedRoom?.errors[0],
        teammates: teammates?.errors[0],
      });
    }

    setIsAwaitingResponse(true);
    const response = await inviteToRoom(zodFormData);
    if (response.status === 200) {
      const params = new URLSearchParams();
      params.append('username', form.username);
      params.append('room', response.roomNameUnique);

      router.push(`/room?${params.toString()}`);
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  return (
    <>
      <FormSelectField
        label='Select Room'
        id='selectPlanningPokerRoom'
        name='selectedRoom'
        value={form?.selectedRoom}
        onChangeHandler={handleFormSelectField}
        options={userRooms}
        errorMessage={errorMessage.selectedRoom}
      />
      <div className='auth-form__form-field-with-cta-wrapper'>
        <p>Teammate Email Address</p>
        {form?.teammates?.length > 0 &&
          form?.teammates?.map((item, index) => (
            <FormAddTextField
              key={`form-add-text-field__${index}`}
              setForm={setForm}
              emailAddressItem={item}
            />
          ))}
        {!isAwaitingResponse && (
          <FormAddTextField
            setForm={setForm}
            emailAddress={emailAddress}
            setEmailAddress={setEmailAddress}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
        <CTA
          icon={<MdAddCircle />}
          text='Add Another Email Address'
          className='cta-button cta-button--icon cta-button--icon-green'
          ariaLabel='Add Teammate Email'
          btnType='button'
          handleClick={handleAddTeammate}
        />
      </div>
      <CTA
        text='Invite to Room'
        className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
        ariaLabel='Invite Teammate to Existing Agile Story Planning Poker Room'
        btnType='button'
        handleClick={
          emailAddress ? handleAddTeammateAndInviteToRoom : handleInviteToRoom
        }
        id='createRoomBtn'
        showSpinner={isAwaitingResponse}
      />
      <CTA
        text='Go Back'
        className='cta-button cta-text-link'
        ariaLabel='Go Back to Choose Room, Create Room or Invite to Room'
        btnType='button'
        handleClick={() => {
          setShowInviteTeammate(false);
          setForm((current) => {
            return { ...current, selectedRoom: '', teammates: [] };
          });
          setErrorMessage({
            selectedRoom: '',
            teammates: '',
          });
        }}
      />
    </>
  );
};

export default FormInviteToRoom;
