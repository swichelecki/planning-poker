'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { requestUserPasswordReset, resetUserPassword } from '../../actions';
import { useAppContext } from '../../context';
import { z } from 'zod';
import { FormTextField, CTA } from '../../components';
import { useScrollToTop } from '../../hooks';
import {
  requestPasswordResetSchema,
  resetPasswordSchema,
} from '../../schemas/schemas';
import { FORM_ERROR_USER_NOT_FOUND } from '../../constants';

const Toast = dynamic(() => import('../../components/shared/Toast'), {
  ssr: false,
});

const ResetForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [userId] = params.values();
  const isResetPassword = !!userId;

  useScrollToTop();
  const { setShowToast } = useAppContext();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userId: userId ?? '',
  });
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isAwaitingResponse, setisAwaitingResponse] = useState(false);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const zodSchema = isResetPassword
      ? resetPasswordSchema
      : requestPasswordResetSchema;

    const zodValidationResults = zodSchema.safeParse(form);
    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success && isResetPassword) {
      const { properties } = z.treeifyError(error);
      const { email, password, confirmPassword } = properties;

      if (!email && !password && !confirmPassword) {
        const serverError = {
          status: 400,
          error: 'Zod validation failed. Check console.',
        };
        setShowToast(<Toast serverError={serverError} />);
        console.error(error);
        return;
      }

      return setErrorMessage({
        email: email?.errors[0],
        password: password?.errors[0],
        confirmPassword: confirmPassword?.errors[0],
      });
    }

    if (!success && !isResetPassword) {
      const { properties } = z.treeifyError(error);
      const { email } = properties;
      return setErrorMessage({
        email: email?.errors[0],
      });
    }

    setisAwaitingResponse(true);
    isResetPassword
      ? resetUserPassword(zodFormData).then((res) => {
          if (res.status === 200) {
            router.push('/login');
          }

          if (res.status === 404) {
            setErrorMessage({
              email: FORM_ERROR_USER_NOT_FOUND,
            });
            setisAwaitingResponse(false);
          }

          if (res.status !== 200 && res.status !== 404) {
            setShowToast(<Toast serverError={res} />);
            setisAwaitingResponse(false);
          }
        })
      : requestUserPasswordReset(zodFormData).then((res) => {
          if (res.status === 200) {
            setShowToast(
              <Toast isSuccess message='Check your email to reset password.' />,
            );
            setisAwaitingResponse(false);
          }

          if (res.status === 404) {
            setErrorMessage({
              email: FORM_ERROR_USER_NOT_FOUND,
            });
            setisAwaitingResponse(false);
          }

          if (res.status !== 200 && res.status !== 404) {
            setShowToast(<Toast serverError={res} />);
            setisAwaitingResponse(false);
          }
        });
  };

  return (
    <form onSubmit={onSubmit} className='auth-form__form'>
      <FormTextField
        label='Email'
        type='email novalidate'
        id='email'
        name='email'
        value={form?.email}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.email}
      />
      {isResetPassword && (
        <>
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
      <CTA
        text={
          isResetPassword ? 'Create New Password' : 'Request Password Reset'
        }
        className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
        ariaLabel={
          isResetPassword
            ? 'Create a New Agile Story Planning Poker Password'
            : 'Request Password Reset for Agile Story Planning Poker'
        }
        btnType='submit'
        showSpinner={isAwaitingResponse}
      />
      <div className='auth-form__cta-text-links-wrapper'>
        <CTA
          text='Log In'
          type='anchor'
          href='/login'
          className='cta-text-link'
          ariaLabel='Log in to Agile Story Planning Poker'
        />
        <CTA
          text='Sign Up'
          type='anchor'
          href='/signup'
          className='cta-text-link'
          ariaLabel='Sign up for Agile Story Planning Poker'
        />
      </div>
    </form>
  );
};

// have to wrap form in suspense boundry because it is a static page using useSearchParams
const Reset = () => {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
};

export default Reset;
