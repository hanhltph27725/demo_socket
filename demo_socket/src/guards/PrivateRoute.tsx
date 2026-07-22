import { Storage } from '@/constants/storage';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from 'simplize-component';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = (props): JSX.Element => {
  const { children } = props;
  const token = getCookie(Storage.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
