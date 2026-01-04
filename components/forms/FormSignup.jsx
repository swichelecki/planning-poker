'use client';

import { createUser } from '../../actions';
import { FormTextField, CTA, Toast } from '../../components';
import { z } from 'zod';
import { createUserSchema } from '../../schemas/schemas';
import { USER_ALREADY_EXISTS } from '../../constants';

const FormSignup = ({
  form,
  setForm,
  handleForm,
  errorMessage,
  setErrorMessage,
  isAwaitingResponse,
  setIsAwaitingResponse,
  setShow2FactorAuthField,
  setShowToast,
  isInvitation,
}) => {
  // create account and send user 2-factor authentication code in email
  const handleCreateUser = async () => {
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
      !isInvitation
        ? zodFormData
        : {
            ...zodFormData,
            team: form.team,
            teamNameUnique: form.teamNameUnique,
          },
      isInvitation
    );
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

  return (
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
        className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
        ariaLabel='Create your Agile Story Planning Poker account'
        btnType='button'
        handleClick={handleCreateUser}
        showSpinner={isAwaitingResponse}
      />
      {!isInvitation && (
        <CTA
          text='Log In'
          type='anchor'
          href='/login'
          className='cta-text-link'
          ariaLabel='Log in to Agile Story Planning Poker'
        />
      )}
    </>
  );
};

export default FormSignup;
