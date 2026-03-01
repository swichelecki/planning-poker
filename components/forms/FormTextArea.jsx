'use client';

import { FormErrorMessage } from '../';

export default function FormTextArea({
  editorRef,
  label = '',
  onChangeHandler,
  errorMessage,
}) {
  // set state while typing
  const handleInput = () => {
    onChangeHandler(`<p>${editorRef.current.innerHTML}</p>`);
  };

  // add line breaks
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editorRef.current.innerHTML === '') {
        editorRef.current.innerHTML = '<br>';
      }
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const br = document.createElement('br');
      range.insertNode(br);
      // a trailing <br> at the end of a block element is invisible
      // only add a placeholder when there's no visible text after the <br>
      if (
        (!br.nextSibling || !br.nextSibling.textContent) &&
        br.nextSibling.nodeName !== 'BR'
      ) {
        const placeholder = document.createElement('br');
        br.parentNode.insertBefore(placeholder, br.nextSibling);
      }
      range.setStartAfter(br);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      handleInput();
    }
  };

  return (
    <div className={`form-field${errorMessage ? ' form-field--error' : ''}`}>
      <p>{label}</p>
      <div
        className='form-field__text-area'
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        role='textbox'
        aria-multiline='true'
      />
      {errorMessage && <FormErrorMessage errorMessage={errorMessage} />}
    </div>
  );
}
