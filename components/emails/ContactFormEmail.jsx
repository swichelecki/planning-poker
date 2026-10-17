import DOMPurify from 'isomorphic-dompurify';

const ContactFormEmail = ({ message }) => {
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) ?? '' }}
      />
    </div>
  );
};

export default ContactFormEmail;
