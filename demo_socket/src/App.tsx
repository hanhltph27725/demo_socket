import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { NavigateAnimation } from 'simplize-component';
import { routes } from './router';

const App: React.FC = (): JSX.Element => {
  const location = useLocation();

  return (
    <NavigateAnimation
      RoutesElement={Routes}
      location={location}
      routes={routes}
    >
      {Object.values(routes).map((route, index) => (
        <Route path={route.url} element={route.element} key={index} />
      ))}
    </NavigateAnimation>
  );
};

export default App;
