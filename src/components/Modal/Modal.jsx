import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Overlay, ModalWindow } from './Modal.styled';
const modalRoot = document.querySelector('#modal-root');

const Modal = ({ closeModal, url, alt }) => {
  useEffect(() => {
    const onEscapeClick = event => {
      if (event.code === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', onEscapeClick);

    return () => {
      window.removeEventListener('keydown', onEscapeClick);
    };
  }, [closeModal]);

  const onBackdropClick = event => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return createPortal(
    <Overlay onClick={onBackdropClick}>
      <ModalWindow>
        <img src={url} alt={alt} />
      </ModalWindow>
    </Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  url: PropTypes.string,
  alt: PropTypes.string,
};

export default Modal;
