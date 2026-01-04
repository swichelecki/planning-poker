'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../context';
import { Form2FactorAuth, FormSignup } from '../../components';
import { useScrollToTop } from '../../hooks';
import { handleRoomNameFormatting } from '../../utilities/handleRoomNameFormatting';

const InvitationForm = () => {
  const searchParams = useSearchParams();
  const room = searchParams.get('room');
  const email = searchParams.get('email');
  const decodedRoom = decodeURI(room);
  const decodedEmail = decodeURI(email);

  useScrollToTop();
  const { setShowToast } = useAppContext();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: decodedEmail,
    password: '',
    confirmPassword: '',
    verification: '',
    team: handleRoomNameFormatting(decodedRoom),
    teamNameUnique: decodedRoom,
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

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  return (
    <form className='auth-form__form'>
      {/* step 1: create account */}
      {!show2FactorAuthField && (
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
          isInvitation={true}
        />
      )}
      {/* step 2: 2-factor authentication */}
      {show2FactorAuthField && (
        <Form2FactorAuth
          form={form}
          handleForm={handleForm}
          errorMessage={errorMessage}
          isAwaitingResponse={isAwaitingResponse}
          setErrorMessage={setErrorMessage}
          setIsAwaitingResponse={setIsAwaitingResponse}
          setShow2FactorAuthField={setShow2FactorAuthField}
          setShowToast={setShowToast}
          isInvitation={true}
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
