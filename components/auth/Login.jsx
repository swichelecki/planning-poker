'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { request2FactorAuthentication } from '../../actions';
import { useAppContext } from '../../context';
import { z } from 'zod';
import {
  FormTextField,
  FormSelectField,
  Form2FactorAuth,
  FormCreateRoom,
  CTA,
  Toast,
} from '../../components';
import { useScrollToTop } from '../../hooks';
import { loginSchema, chooseRoomSchema } from '../../schemas/schemas';
import { INCORRECT_EMAIL_PASSWORD } from '../../constants';

const Login = ({ user }) => {
  const { _id: userId, rooms, isAdmin, firstName, lastName } = user;

  const router = useRouter();
  const searchParams = useSearchParams();
  const room = searchParams.get('room');
  const decodedRoom = decodeURI(room);

  useScrollToTop();
  const { setShowToast, setUserId, setIsAdmin } = useAppContext();

  const [form, setForm] = useState({
    email: '',
    password: '',
    verification: '',
    userId: userId ?? '',
    username: userId ? `${firstName} ${lastName}` : '',
    team: '',
    teammates: [],
    selectedRoom: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
    verification: '',
    selectedRoom: '',
    team: '',
    teammates: '',
  });
  const [show2FactorAuthField, setShow2FactorAuthField] = useState(false);
  const [showChooseRoom, setShowChooseRoom] = useState(false);
  const [showCreateNewRoom, setshowCreateNewRoom] = useState(false);
  const [userRooms, setUserRooms] = useState([]);
  const [emailAddress, setEmailAddress] = useState('');
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  // if already logged in skip first step of form and set global state
  useEffect(() => {
    if (userId) {
      setShowChooseRoom(true);
      setUserRooms(rooms);
      setUserId(userId);
      setIsAdmin(isAdmin);
    }
  }, [userId, rooms, isAdmin]);

  // if existing user invited via email to new room go directly to room
  useEffect(() => {
    if (showChooseRoom && decodedRoom !== 'null') {
      const params = new URLSearchParams();
      params.append('username', `${firstName} ${lastName}`);
      params.append('room', decodedRoom);

      router.push(`/room?${params.toString()}`);
    }
  }, [showChooseRoom]);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  const handleFormSelectField = (optionName, optionValue) => {
    setForm({ ...form, [optionName]: optionValue });

    if (errorMessage[optionName]) {
      setErrorMessage({ ...errorMessage, [optionName]: '' });
    }
  };

  // send user 2-factor authentication code in email on Log In button click
  const handleBeginLoginProcess = async (e) => {
    e.preventDefault();

    const zodValidationResults = loginSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { email, password } = properties;
      return setErrorMessage({
        ...errorMessage,
        email: email?.errors[0],
        password: password?.errors[0],
      });
    }

    setIsAwaitingResponse(true);
    const response = await request2FactorAuthentication(zodFormData);
    if (response.status === 200) {
      setShow2FactorAuthField(true);
      setIsAwaitingResponse(false);
    } else if (response.status === 403) {
      setIsAwaitingResponse(false);
      setErrorMessage({
        email: INCORRECT_EMAIL_PASSWORD,
        password: INCORRECT_EMAIL_PASSWORD,
      });
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  // choose and join room
  const handleChooseRoom = async (e) => {
    e.preventDefault();

    const zodValidationResults = chooseRoomSchema.safeParse(form);
    const { success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { selectedRoom } = properties;

      if (!selectedRoom) {
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
      });
    }

    setIsAwaitingResponse(true);
    const params = new URLSearchParams();
    params.append('username', form.username);
    params.append('room', form.selectedRoom);

    router.push(`/room?${params.toString()}`);
  };

  // if user don't show ui until state set so step 1 skipped
  if (
    (userId && !showChooseRoom) ||
    (userId && showChooseRoom && decodedRoom !== 'null')
  ) {
    return <></>;
  }

  return (
    <form
      onSubmit={
        !show2FactorAuthField && !showChooseRoom
          ? handleBeginLoginProcess
          : showChooseRoom && !showCreateNewRoom
            ? handleChooseRoom
            : null
      }
      className='auth-form__form'
    >
      {/* step 1: enter user name and password */}
      {!show2FactorAuthField && !showChooseRoom && (
        <>
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
          <CTA
            text='Log In'
            className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
            ariaLabel='Log in to Agile Story Planning Poker'
            btnType='submit'
            showSpinner={isAwaitingResponse}
          />
          <CTA
            text='Sign Up'
            type='anchor'
            href='/signup'
            className='cta-text-link'
            ariaLabel='Sign up for Agile Story Planning Poker'
          />
          {/*  <CTA
            text='Forgot Password'
            type='anchor'
            href='/reset'
            className='cta-text-link'
            ariaLabel='Reset password'
          /> */}
        </>
      )}
      {/* step 2: enter 2-factor authentication */}
      {show2FactorAuthField && (
        <Form2FactorAuth
          form={form}
          setForm={setForm}
          handleForm={handleForm}
          errorMessage={errorMessage}
          isAwaitingResponse={isAwaitingResponse}
          setErrorMessage={setErrorMessage}
          setIsAwaitingResponse={setIsAwaitingResponse}
          setShow2FactorAuthField={setShow2FactorAuthField}
          decodedRoom={decodedRoom}
          setShowChooseRoom={setShowChooseRoom}
          setUserRooms={setUserRooms}
          setShowToast={setShowToast}
        />
      )}
      {/* step 3: enter room or create new room */}
      {showChooseRoom && !showCreateNewRoom && (
        <>
          <FormSelectField
            label='Select Team'
            id='selectPlanningPokerRoom'
            name='selectedRoom'
            value={form?.selectedRoom}
            onChangeHandler={handleFormSelectField}
            options={userRooms}
            errorMessage={errorMessage.selectedRoom}
          />
          <CTA
            text='Enter Room'
            className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
            ariaLabel='Enter Agile Story Planning Poker Room'
            btnType='submit'
            showSpinner={isAwaitingResponse}
          />
          <p className='auth-form__message'>
            &mdash; Or Create a New Room &mdash;
          </p>
          <CTA
            text='Create Room'
            className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
            ariaLabel='Create a New Agile Story Planning Poker Room and Invite Teammates'
            btnType='button'
            handleClick={() => {
              setshowCreateNewRoom(true);
            }}
          />
        </>
      )}
      {/* optional step 4: create new room */}
      {showCreateNewRoom && (
        <FormCreateRoom
          form={form}
          setForm={setForm}
          handleForm={handleForm}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isAwaitingResponse={isAwaitingResponse}
          setIsAwaitingResponse={setIsAwaitingResponse}
          emailAddress={emailAddress}
          setEmailAddress={setEmailAddress}
          isLogin={true}
          setshowCreateNewRoom={setshowCreateNewRoom}
        />
      )}
    </form>
  );
};

export default Login;
