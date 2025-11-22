'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUser, loginUser } from '../../actions';
import { useAppContext } from '../../context';
import { FormTextField, CTA, Toast } from '../../components';
import { z } from 'zod';
import { createUserSchema, loginSchema } from '../../schemas/schemas';
import { USER_ALREADY_EXISTS } from '../../constants';

const InvitationForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [room] = params.values();
  const decodedRoom = decodeURI(room);

  const { setShowToast } = useAppContext();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verification: '',
    team: decodedRoom?.split('|')[0] ?? '',
    teamNameUnique: decodedRoom?.split('|')[1] ?? '',
  });
  const [errorMessage, setErrorMessage] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verification: '',
  });
  const [show2FactorAuthField, setShow2FactorAuthField] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  // when 6-digit 2-factor authentication code added to form log in user
  useEffect(() => {
    if (form.verification.length >= 6) {
      handleUserLoginAfter2FactorVerification();
    }
  }, [form.verification]);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  // create account and send user 2-factor authentication code in email
  const handleCreateUser = async (e) => {
    e.preventDefault();

    const zodValidationResults = createUserSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { firstName, lastName, email, password, confirmPassword } =
        properties;
      return setErrorMessage({
        ...errorMessage,
        firstName: firstName?.errors[0],
        lastName: lastName?.errors[0],
        email: email?.errors[0],
        password: password?.errors[0],
        confirmPassword: confirmPassword?.errors[0],
      });
    }

    setIsAwaitingResponse(true);
    const response = await createUser(
      { ...zodFormData, team: form.team, teamNameUnique: form.teamNameUnique },
      true
    );
    if (response.status === 200) {
      setShow2FactorAuthField(true);
      setIsAwaitingResponse(false);
    } else if (response.status === 409) {
      setIsAwaitingResponse(false);
      setErrorMessage({
        ...errorMessage,
        email: USER_ALREADY_EXISTS,
      });
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  // log in user
  const handleUserLoginAfter2FactorVerification = async () => {
    const zodValidationResults = loginSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { verification } = properties;
      return setErrorMessage({
        ...errorMessage,
        verification: verification?.errors[0],
      });
    }

    setIsAwaitingResponse(true);
    const response = await loginUser(zodFormData);
    if (response.status === 200) {
      router.push('/room');
      setIsAwaitingResponse(false);
    } else if (response.status === 403 || response.status === 410) {
      setIsAwaitingResponse(false);
      setErrorMessage({ ...errorMessage, verification: response.error });
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  return (
    <form onSubmit={handleCreateUser} className='auth-form__form'>
      {/* step 1: create account */}
      {!show2FactorAuthField && (
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
          <FormTextField
            label='Email'
            type='email novalidate'
            id='email'
            name='email'
            value={form?.email}
            onChangeHandler={handleForm}
            errorMessage={errorMessage.email}
          />
          <FormTextField
            label='Password'
            type='password'
            id='password'
            name='password'
            value={form?.password}
            onChangeHandler={handleForm}
            errorMessage={errorMessage.password}
          />
          <FormTextField
            label='Confirm Password'
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={form?.confirmPassword}
            onChangeHandler={handleForm}
            errorMessage={errorMessage.confirmPassword}
          />
          <CTA
            text='Create Account'
            className='cta-button cta-button--large cta-button--full cta-button--purple'
            ariaLabel='Create your Planning Poker account'
            btnType='submit'
            showSpinner={isAwaitingResponse}
          />
        </>
      )}
      {/* step 2: 2-factor authentication */}
      {show2FactorAuthField && (
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
      )}
    </form>
  );
};

// have to wrap form in suspense boundry because it is a static page using useSearchParams
const Invitation = () => {
  return (
    <Suspense>
      <InvitationForm />
    </Suspense>
  );
};

export default Invitation;
