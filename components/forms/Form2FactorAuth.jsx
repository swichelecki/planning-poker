'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../actions';
import { FormTextField, Toast } from '../../components';
import { z } from 'zod';
import { loginSchema } from '../../schemas/schemas';

const Form2FactorAuth = ({
  form,
  setForm,
  handleForm,
  errorMessage,
  isAwaitingResponse,
  setErrorMessage,
  setIsAwaitingResponse,
  setShow2FactorAuthField,
  setShowCreateRoom,
  setShowChooseRoom,
  setUserRooms,
  setShowToast,
  isInvitation,
}) => {
  const router = useRouter();

  // when 6-digit 2-factor authentication code added to form log in user
  useEffect(() => {
    if (form.verification.length >= 6) {
      handleUserLoginAfter2FactorVerification();
    }
  }, [form.verification]);

  // log in user and show create-room UI
  const handleUserLoginAfter2FactorVerification = async () => {
    const zodValidationResults = loginSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { verification } = properties;
      return setErrorMessage({ verification: verification?.errors[0] });
    }

    setIsAwaitingResponse(true);
    const response = await loginUser(zodFormData);
    if (response.status === 200) {
      // go to choose or create room UI after signup or login
      if (!isInvitation) {
        setIsAwaitingResponse(false);
        setShow2FactorAuthField(false);
        setShowCreateRoom?.(true);
        setShowChooseRoom?.(true);
        setForm?.({
          ...form,
          userId: response.user._id,
          username: `${response.user.firstName} ${response.user.lastName}`,
        });
        setUserRooms?.(response.user.rooms);
      }

      // if new user accepts invitation go directly to room
      if (isInvitation) {
        const params = new URLSearchParams();
        params.append('username', `${form.firstName} ${form.lastName}`);
        params.append('room', form.teamNameUnique);

        router.push(`/room?${params.toString()}`);
      }
    } else if (response.status === 403 || response.status === 410) {
      setIsAwaitingResponse(false);
      setErrorMessage({
        ...errorMessage,
        verification: response.error,
      });
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  return (
    <FormTextField
      label='Verification Code'
      subLabel='Check your email and enter 6-digit verification code'
      type='text'
      id='verification'
      name='verification'
      value={form?.verification}
      onChangeHandler={handleForm}
      errorMessage={errorMessage.verification}
      showSpinner={isAwaitingResponse}
    />
  );
};

export default Form2FactorAuth;
