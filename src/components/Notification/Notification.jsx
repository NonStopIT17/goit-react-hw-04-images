import React from 'react';
import PropTypes from 'prop-types';
import { Message } from './Notification.styled';

const Notification = ({ children }) => {
  return <Message>{children}</Message>;
};

Notification.propTypes = {
  children: PropTypes.node,
};

export default Notification;
