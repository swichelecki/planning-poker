'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { changeUserPassword, deleteUserAccount } from '../../actions';
import { useAppContext } from '../../context';
import { useScrollToTop } from '../../hooks';
import { FormTextField, CTA } from '../../components';
import { z } from 'zod';
import {
  changePasswordSchema,
  deleteAccountSchema,
} from '../../schemas/schemas';
import { INCORRECT_EMAIL_PASSWORD } from '../../constants';

const Toast = dynamic(() => import('../../components/shared/Toast'), {
  ssr: false,
});

function Account({ userId }) {
  const router = useRouter();

  useScrollToTop();
  const { setShowToast } = useAppContext();

  const [form, setForm] = useState({
    userId,
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    deleteEmail: '',
    deletePassword: '',
    deleteConfirmation: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    deleteEmail: '',
    deletePassword: '',
    deleteConfirmation: '',
  });
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  // change password
  const changePassword = async (e) => {
    e.preventDefault();

    const zodValidationResults = changePasswordSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { email, password, newPassword, confirmNewPassword } = properties;

      if (!email && !password && !newPassword && !confirmNewPassword) {
        const serverError = {
          status: 400,
          error: 'Zod validation failed. Check console.',
        };
        setShowToast(<Toast serverError={serverError} />);
        console.error(error);
        return;
      }

      setErrorMessage({
        email: email?.errors[0],
        password: password?.errors[0],
        newPassword: newPassword?.errors[0],
        confirmNewPassword: confirmNewPassword?.errors[0],
      });
      return;
    }

    setIsAwaitingResponse(true);
    const response = await changeUserPassword(zodFormData);
    if (response.status === 200) {
      router.push('/login');
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

  // delete account
  const deleteAccount = async (e) => {
    e.preventDefault();

    const zodValidationResults = deleteAccountSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { deleteEmail, deletePassword, deleteConfirmation } = properties;

      if (!deleteEmail && !deletePassword && !deleteConfirmation) {
        const serverError = {
          status: 400,
          error: 'Zod validation failed. Check console.',
        };
        setShowToast(<Toast serverError={serverError} />);
        console.error(error);
        return;
      }

      setErrorMessage({
        deleteEmail: deleteEmail?.errors[0],
        deletePassword: deletePassword?.errors[0],
        deleteConfirmation: deleteConfirmation?.errors[0],
      });
      return;
    }

    setIsAwaitingResponse(true);
    const response = await deleteUserAccount(zodFormData);
    if (response.status === 200) {
      router.push('/');
      router.refresh();
    } else if (response.status === 403) {
      setIsAwaitingResponse(false);
      setErrorMessage({
        deleteEmail: INCORRECT_EMAIL_PASSWORD,
        deletePassword: INCORRECT_EMAIL_PASSWORD,
      });
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  return (
    <div className='auth-form__form'>
      <h1 className='h2'>Change Password</h1>
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
        label='Current Password'
        type='password'
        id='password'
        name='password'
        value={form?.password}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.password}
      />
      <FormTextField
        label='New Password'
        type='password'
        id='newPassword'
        name='newPassword'
        value={form?.newPassword}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.newPassword}
      />
      <FormTextField
        label='Confirm New Password'
        type='password'
        id='confirmNewPassword'
        name='confirmNewPassword'
        value={form?.confirmNewPassword}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.confirmNewPassword}
      />
      <CTA
        text='Change Password'
        btnType='button'
        className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
        ariaLabel='Change your password'
        showSpinner={isAwaitingResponse}
        handleClick={changePassword}
      />
      <h1 className='h2'>Delete Account</h1>
      <FormTextField
        label='Email'
        type='email novalidate'
        id='deleteEmail'
        name='deleteEmail'
        value={form?.deleteEmail}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.deleteEmail}
      />
      <FormTextField
        label='Password'
        type='password'
        id='deletePassword'
        name='deletePassword'
        value={form?.deletePassword}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.deletePassword}
      />
      <FormTextField
        label='Type "Delete My Account"'
        type='text'
        id='deleteConfirmation'
        name='deleteConfirmation'
        value={form?.deleteConfirmation}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.deleteConfirmation}
      />
      <CTA
        text='Delete Account'
        btnType='button'
        className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--red'
        ariaLabel='Delete your account'
        showSpinner={isAwaitingResponse}
        handleClick={deleteAccount}
      />
    </div>
  );
}

export default Account;
