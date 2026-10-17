'use client';

import { useState, useEffect } from 'react';
import { CTA } from '..';
import { MdContentCopy } from 'react-icons/md';
import { useAppContext } from '../../context';

const ModalInvite = ({ room, classNames, notCopiedText, copiedText }) => {
  const { setShowModal } = useAppContext();
  const [isCopied, setIsCopied] = useState(false);

  const domain = process.env.NEXT_PUBLIC_URL;

  const roompath = `${domain}/enter?room=${room}&invite=true`;

  useEffect(() => {
    if (!isCopied) return;

    const isCopiedMsg = setTimeout(() => {
      setIsCopied(false);
      setShowModal(null);
      sessionStorage?.removeItem('isNewRoom');
    }, 2000);

    return () => clearTimeout(isCopiedMsg);
  }, [isCopied]);

  const copyToClipboard = async (roomPath) => {
    try {
      await navigator.clipboard.writeText(roomPath);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div>
      <CTA
        icon={!isCopied ? <MdContentCopy /> : ''}
        text={!isCopied ? notCopiedText : copiedText}
        className={classNames}
        ariaLabel='Copy room url'
        btnType='button'
        handleClick={() => {
          copyToClipboard(roompath);
        }}
      />
    </div>
  );
};

export default ModalInvite;
