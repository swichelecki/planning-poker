'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FormTextField, CTA, FormTextArea } from '../../components';
import { useAppContext } from '../../context';
import { createContactMessage } from '../../actions';
import { z } from 'zod';
import { contactFormSchema } from '../../schemas/schemas';

const Toast = dynamic(() => import('../../components/shared/Toast'), {
  ssr: false,
});

const Contact = ({ userId }) => {
  const editorRef = useRef(null);

  const { setShowToast } = useAppContext();

  const [form, setForm] = useState({
    userId,
    subject: '',
    message: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    subject: '',
    message: '',
  });
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errorMessage[e.target.name]) {
      setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }
  };

  const handleSetMessage = (value) => {
    const message = value === '<p></p>' || value === '<p><br></p>' ? '' : value;
    setForm({ ...form, message });

    if (errorMessage.message) {
      setErrorMessage({ ...errorMessage, message: '' });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const zodValidationResults = contactFormSchema.safeParse(form);

    const { data: zodFormData, success, error } = zodValidationResults;
    if (!success) {
      const { properties } = z.treeifyError(error);
      const { subject, message } = properties;

      if (!subject && !message) {
        const serverError = {
          status: 400,
          error: 'Zod validation failed Check console.',
        };
        setShowToast(<Toast serverError={serverError} />);
        console.error(error);
        return;
      }

      setErrorMessage({
        subject: subject?.errors[0],
        message: message?.errors[0],
      });
      return;
    }

    setIsAwaitingResponse(true);
    const response = await createContactMessage(zodFormData);
    if (response.status === 200) {
      setIsAwaitingResponse(false);
      setForm({ subject: '', message: '' });
      editorRef.current.innerHTML = '';
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setShowToast(<Toast isSuccess message='Thanks for the feedback!' />);
    } else {
      setShowToast(<Toast serverError={response} />);
      setIsAwaitingResponse(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className='auth-form__form'>
      <h2 className='h2'>Contact</h2>
      <FormTextField
        label='Subject'
        type='text'
        id='subject'
        name='subject'
        value={form?.subject}
        onChangeHandler={handleForm}
        errorMessage={errorMessage.subject}
      />
      <FormTextArea
        editorRef={editorRef}
        label='Message'
        onChangeHandler={handleSetMessage}
        errorMessage={errorMessage.message}
      />
      <CTA
        text='Submit'
        btnType='submit'
        className='cta-button cta-button--large cta-button--full cta-button--bold cta-button--purple'
        ariaLabel='Submit feedback to Agile Story Planning Poker'
        showSpinner={isAwaitingResponse}
      />
    </form>
  );
};

export default Contact;
