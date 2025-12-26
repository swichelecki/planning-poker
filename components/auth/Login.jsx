'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  request2FactorAuthentication,
  loginUser,
  createRoom,
} from '../../actions';
import { useAppContext } from '../../context';
import { z } from 'zod';
import {
  FormTextField,
  FormSelectField,
  FormAddTextField,
  CTA,
  Toast,
} from '../../components';
import {
  loginSchema,
  chooseRoomSchema,
  createRoomSchema,
  emailAddressSchema,
} from '../../schemas/schemas';
import { INCORRECT_EMAIL_PASSWORD } from '../../constants';
import { MdAddCircle } from 'react-icons/md';

const Login = ({ user }) => {
  const { _id: userId, rooms, isAdmin, firstName, lastName } = user;

  const router = useRouter();
  const searchParams = useSearchParams();
  const room = searchParams.get('room');
  const decodedRoom = decodeURI(room);

  const { setShowToast, setUserId, setIsAdmin } = useAppContext();

  const [form, setForm] = useState({
    email: '',
    password: '',
    verification: '',
  });
  const [selectRoomForm, setSelectRoomForm] = useState({
    userId: userId ?? '',
    username: `${firstName} ${lastName}` ?? '',
    selectedRoom: '',
  });
  const [createRoomForm, setCreateRoomForm] = useState({
    userId: userId ?? '',
    username: `${firstName} ${lastName}` ?? '',
    team: '',
    teammates: [],
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
  const [addTeammateAndCreateRoom, setAddTeammateAndCreateRoom] =
    useState(false);
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

  // when teammate email not yet in state and form is submitted, add to state and call handleCreateRoom on next render
  useEffect(() => {
    if (addTeammateAndCreateRoom) handleCreateRoom();
  }, [addTeammateAndCreateRoom]);

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
      if (decodedRoom !== 'null') {
        // if existing user invited via email to new room go directly to room
        const params = new URLSearchParams();
        params.append(
          'username',
          `${response.user.firstName} ${response.user.lastName}`
        );
        params.append('room', decodedRoom);

        router.push(`/room?${params.toString()}`);
      } else {
        // go to choose or create room UI
        setIsAwaitingResponse(false);
        setShow2FactorAuthField(false);
        setShowChooseRoom(true);
        setCreateRoomForm({
          ...createRoomForm,
          userId: response.user._id,
          username: `${response.user.firstName} ${response.user.lastName}`,
        });
        setSelectRoomForm({
          ...selectRoomForm,
          userId: response.user._id,
          username: `${response.user.firstName} ${response.user.lastName}`,
        });
        setUserRooms(response.user.rooms);
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

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  const handleFormSelectField = (optionName, optionValue) => {
    setSelectRoomForm({ ...selectRoomForm, [optionName]: optionValue });

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

    const zodValidationResults = chooseRoomSchema.safeParse(selectRoomForm);
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
    params.append('username', selectRoomForm.username);
    params.append('room', selectRoomForm.selectedRoom);

    router.push(`/room?${params.toString()}`);
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

    setCreateRoomForm((current) => {
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

    setCreateRoomForm((current) => {
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
    const zodValidationResults = createRoomSchema.safeParse(createRoomForm);
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
      params.append('username', `${firstName} ${lastName}`);
      params.append('room', response.roomNameUnique);

      router.push(`/room?${params.toString()}`);
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  // if user don't show ui until state set so step 1 skipped
  if (userId && !showChooseRoom) {
    return <></>;
  }

  return (
    <form
      onSubmit={
        !show2FactorAuthField && !showChooseRoom
          ? handleBeginLoginProcess
          : showChooseRoom && !showCreateNewRoom
            ? handleChooseRoom
            : emailAddress && showCreateNewRoom
              ? handleAddTeammateAndCreateRoom
              : handleCreateRoom
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
      {/* step 3: enter room or create new room */}
      {showChooseRoom && !showCreateNewRoom && (
        <>
          <FormSelectField
            label='Select Team'
            id='selectPlanningPokerRoom'
            name='selectedRoom'
            value={selectRoomForm?.selectedRoom}
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
        <>
          <FormTextField
            label='Team Name'
            type='text'
            id='team'
            name='team'
            value={setCreateRoomForm?.team}
            onChangeHandler={(e) => {
              setCreateRoomForm({ ...createRoomForm, team: e.target.value });
              if (errorMessage[e.target.name]) {
                setErrorMessage({ ...errorMessage, [e.target.name]: '' });
              }
            }}
            errorMessage={errorMessage.team}
          />
          {createRoomForm?.teammates?.length > 0 &&
            createRoomForm?.teammates?.map((item, index) => (
              <FormAddTextField
                key={`form-add-text-field__${index}`}
                setForm={setCreateRoomForm}
                emailAddressItem={item}
              />
            ))}
          {!isAwaitingResponse && (
            <FormAddTextField
              setForm={setCreateRoomForm}
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
            btnType='submit'
            id='createRoomBtn'
            showSpinner={isAwaitingResponse}
          />
          <CTA
            text='Go Back'
            className='cta-button cta-text-link'
            ariaLabel='Go Back to Choose Room or Create Room'
            btnType='button'
            handleClick={() => {
              setshowCreateNewRoom(false);
            }}
          />
        </>
      )}
    </form>
  );
};

export default Login;
