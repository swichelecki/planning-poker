'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, loginUser } from '../../actions';
//import { useAppContext } from '../../context';
import { FormTextField, FormAddTextField, CTA, Toast } from '../../components';
import { createUserSchema, loginSchema } from '../../schemas/schemas';
import { USER_ALREADY_EXISTS } from '../../constants';

const Signup = () => {
  const router = useRouter();

  //const { setShowToast } = useAppContext();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verification: '',
    team: '',
    teammates: [],
  });
  const [errorMessage, setErrorMessage] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verification: '',
    team: '',
    teammates: '',
  });
  const [show2FactorAuthField, setShow2FactorAuthField] = useState(false);
  // TODO: showCreateRoom needs to be set back to false by default
  const [showCreateRoom, setShowCreateRoom] = useState(true);
  const [isAwaitingLogInResponse, setisAwaitingLogInResponse] = useState(false);

  console.log('form', form);

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

  const handleUserLoginAfter2FactorVerification = async () => {
    const zodValidationResults = loginSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { verification } = error.flatten().fieldErrors;
      return setErrorMessage({ verification: verification?.[0] });
    }

    setisAwaitingLogInResponse(true);
    const response = await loginUser(zodFormData);
    if (response.status === 200) {
      setShowCreateRoom(true);
      setShow2FactorAuthField(false);
      setisAwaitingLogInResponse(false);
    } else if (response.status === 403 || response.status === 410) {
      setisAwaitingLogInResponse(false);
      setErrorMessage({
        verification: response.error,
      });
    } else {
      setShowToast(<Toast serverError={response} />);
      setisAwaitingLogInResponse(false);
    }
  };

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  /*  const handleAddTeammate = (email) => {
    setForm({ ...form, teammates: [...form.teammates].push(email) });
  }; */

  // create account and send user 2-factor authentication code in email
  const handleCreateUser = async (e) => {
    e.preventDefault();

    const zodValidationResults = createUserSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { name, email, password, confirmPassword, verification } =
        error.flatten().fieldErrors;
      return setErrorMessage({
        name: name?.[0],
        email: email?.[0],
        password: password?.[0],
        confirmPassword: confirmPassword?.[0],
        verification: verification?.[0],
      });
    }

    setisAwaitingLogInResponse(true);
    const response = await createUser(zodFormData);
    if (response.status === 200) {
      setShow2FactorAuthField(true);
      setisAwaitingLogInResponse(false);
    } else if (response.status === 409) {
      setisAwaitingLogInResponse(false);
      setErrorMessage({
        email: USER_ALREADY_EXISTS,
        password: USER_ALREADY_EXISTS,
      });
    } else {
      setShowToast(<Toast serverError={response} />);
      setisAwaitingLogInResponse(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    console.log('form', form);
  };

  return (
    <form
      onSubmit={!showCreateRoom ? handleCreateUser : handleCreateRoom}
      className='auth-form__form'
    >
      {!show2FactorAuthField && !showCreateRoom && (
        <>
          <FormTextField
            label='Name'
            type='text'
            id='name'
            name='name'
            value={form?.name}
            onChangeHandler={handleForm}
            errorMessage={errorMessage.name}
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
          showSpinner={isAwaitingLogInResponse}
        />
      )}
      {showCreateRoom && (
        <>
          <FormTextField
            label='Team Name'
            //subLabel='Create a team name for which you want a planning poker room'
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
                emailAddressMapped={item}
                // make this a delete button
                //handleAddTeammate={handleAddTeammate}
              />
            ))}
          <FormAddTextField
            teammates={form?.teammates}
            handleAddTeammate={setForm}
          />
        </>
      )}
      <div className='entry-form__form-row'>
        {!show2FactorAuthField && !showCreateRoom && (
          <CTA
            text='Create Account'
            className='cta-button cta-button--large cta-button--full cta-button--purple'
            ariaLabel='Create your Saturday account'
            btnType='submit'
            showSpinner={isAwaitingLogInResponse}
          />
        )}
        {showCreateRoom && (
          <CTA
            text='Create Team and Invite Teammates'
            className='cta-button cta-button--large cta-button--full cta-button--purple'
            ariaLabel='Create Team and Invite Teammates'
            btnType='submit'
            showSpinner={isAwaitingLogInResponse}
          />
        )}
        <CTA
          text='Log In'
          type='anchor'
          href='/login'
          className='cta-text-link'
          ariaLabel='Log in to Saturday'
        />
        {/*   <CTA
          text='Forgot Password'
          type='anchor'
          href='/reset'
          className='cta-text-link'
          ariaLabel='Reset password'
        /> */}
      </div>
    </form>
  );
};

export default Signup;
