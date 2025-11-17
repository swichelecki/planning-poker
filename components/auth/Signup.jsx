'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, loginUser, createRoom } from '../../actions';
//import { useAppContext } from '../../context';
import { FormTextField, FormAddTextField, CTA, Toast } from '../../components';
import { z } from 'zod';
import {
  createUserSchema,
  createRoomSchema,
  loginSchema,
  emailAddressSchema,
} from '../../schemas/schemas';
import { USER_ALREADY_EXISTS } from '../../constants';

const Signup = () => {
  const router = useRouter();

  //const { setShowToast } = useAppContext();

  const [form, setForm] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verification: '',
    team: '',
    teammates: [],
  });
  const [errorMessage, setErrorMessage] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verification: '',
    team: '',
    teammates: '',
  });
  const [emailAddress, setEmailAddress] = useState('');
  const [show2FactorAuthField, setShow2FactorAuthField] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [addTeammateAndCreateRoom, setAddTeammateAndCreateRoom] =
    useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  // when 6-digit 2-factor authentication code added to form log in user
  useEffect(() => {
    if (form.verification.length >= 6) {
      handleUserLoginAfter2FactorVerification();
    }
  }, [form.verification]);

  useEffect(() => {
    if (window && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  // when teammate email not yet in state and form is submitted, add to state and call handleCreateRoom on next render
  useEffect(() => {
    if (addTeammateAndCreateRoom) handleCreateRoom();
  }, [addTeammateAndCreateRoom]);

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
    const response = await createUser(zodFormData);
    if (response.status === 200) {
      setShow2FactorAuthField(true);
      setIsAwaitingResponse(false);
      setForm({ ...form, userId: response.userId });
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

  // log in user and show create-room UI
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
      setShowCreateRoom(true);
      setShow2FactorAuthField(false);
      setIsAwaitingResponse(false);
    } else if (response.status === 403 || response.status === 410) {
      setIsAwaitingResponse(false);
      setErrorMessage({ ...errorMessage, verification: response.error });
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

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
  const handleCreateRoom = async (e = null) => {
    e?.preventDefault();
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
      router.push('/room');
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  return (
    <form
      onSubmit={
        !showCreateRoom
          ? handleCreateUser
          : emailAddress
            ? handleAddTeammateAndCreateRoom
            : handleCreateRoom
      }
      className='auth-form__form'
    >
      {/* create account fields */}
      {!show2FactorAuthField && !showCreateRoom && (
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
        </>
      )}
      {/* 2-factor authentication field */}
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
      {/* create room and invite teammates fields */}
      {showCreateRoom && (
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
          <div className='form-field'>
            <CTA
              text='+'
              className='cta-button cta-button--small cta-button--green'
              ariaLabel='Add Teammate Email'
              btnType='button'
              handleClick={handleAddTeammate}
            />
          </div>
        </>
      )}
      <div className='entry-form__form-row'>
        {/* create account button */}
        {!show2FactorAuthField && !showCreateRoom && (
          <CTA
            text='Create Account'
            className='cta-button cta-button--large cta-button--full cta-button--purple'
            ariaLabel='Create your Planning Poker account'
            btnType='submit'
            showSpinner={isAwaitingResponse}
          />
        )}
        {/* create room and invite teammates button */}
        {showCreateRoom && (
          <CTA
            text='Create Room & Invite Teammates'
            className='cta-button cta-button--large cta-button--full cta-button--purple'
            ariaLabel='Create Room & Invite Teammatess'
            btnType='submit'
            id='createRoomBtn'
            showSpinner={isAwaitingResponse}
          />
        )}
        <CTA
          text='Log In'
          type='anchor'
          href='/login'
          className='cta-text-link'
          ariaLabel='Log in to Planning Poker'
        />
      </div>
    </form>
  );
};

export default Signup;
