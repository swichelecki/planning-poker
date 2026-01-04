'use client';

import { useState } from 'react';
import { useAppContext } from '../../context';
import { Form2FactorAuth, FormSignup, FormCreateRoom } from '../../components';
import { useScrollToTop } from '../../hooks';

const Signup = () => {
  useScrollToTop();
  const { setShowToast } = useAppContext();

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
    username: '',
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
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  return (
    <form className='auth-form__form'>
      {/* step 1: create account */}
      {!show2FactorAuthField && !showCreateRoom && (
        <FormSignup
          form={form}
          setForm={setForm}
          handleForm={handleForm}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isAwaitingResponse={isAwaitingResponse}
          setIsAwaitingResponse={setIsAwaitingResponse}
          setShow2FactorAuthField={setShow2FactorAuthField}
          setShowToast={setShowToast}
        />
      )}
      {/* step 2: 2-factor authentication */}
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
          setShowCreateRoom={setShowCreateRoom}
          setShowToast={setShowToast}
        />
      )}
      {/* step 3: create room and invite teammates fields */}
      {showCreateRoom && (
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
        />
      )}
    </form>
  );
};

export default Signup;
