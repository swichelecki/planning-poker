'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '../../actions';
import { FormTextField, FormAddTextField, CTA, Toast } from '../../components';
import { z } from 'zod';
import { createRoomSchema, emailAddressSchema } from '../../schemas/schemas';
import { MdAddCircle } from 'react-icons/md';

const FormCreateRoom = ({
  form,
  setForm,
  handleForm,
  errorMessage,
  setErrorMessage,
  isAwaitingResponse,
  setIsAwaitingResponse,
  emailAddress,
  setEmailAddress,
  isLogin,
  setshowCreateNewRoom,
}) => {
  const router = useRouter();

  const [addTeammateAndCreateRoom, setAddTeammateAndCreateRoom] =
    useState(false);

  // when teammate email not yet in state and form is submitted, add to state and call handleCreateRoom on next render
  useEffect(() => {
    if (addTeammateAndCreateRoom) handleCreateRoom();
  }, [addTeammateAndCreateRoom]);

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

  // when teammate email not yet in state and form is submitted, add to state and call handleCreateRoom on next render
  const handleAddTeammateAndCreateRoom = (e) => {
    e.preventDefault();
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
    setAddTeammateAndCreateRoom(true);
  };

  // create room and invite teammates
  const handleCreateRoom = async () => {
    const zodValidationResults = createRoomSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { team, teammates } = properties;

      if (!team && !teammates) {
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
        team: team?.errors[0],
        teammates: teammates?.errors[0],
      });
    }

    setIsAwaitingResponse(true);
    const response = await createRoom(zodFormData);
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
      <FormTextField
        label='Team Name'
        type='text'
        id='team'
        name='team'
        value={form?.team}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.team}
      />
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
      <CTA
        text='Create Room'
        className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
        ariaLabel='Create Room & Invite Teammatess'
        btnType='button'
        handleClick={
          emailAddress ? handleAddTeammateAndCreateRoom : handleCreateRoom
        }
        id='createRoomBtn'
        showSpinner={isAwaitingResponse}
      />
      {isLogin && (
        <CTA
          text='Go Back'
          className='cta-button cta-text-link'
          ariaLabel='Go Back to Choose Room or Create Room'
          btnType='button'
          handleClick={() => {
            setshowCreateNewRoom(false);
          }}
        />
      )}
    </>
  );
};

export default FormCreateRoom;
