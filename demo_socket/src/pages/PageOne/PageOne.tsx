import dayjs from 'dayjs';
import React from 'react';

const PageOne: React.FC = (): JSX.Element => {
  const id = 12;

  const saveLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocal = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  const register = (userId, startDate, endDate, countDown, startTime) => {
    const expireTime = startTime + countDown * 1000;

    saveLocal(`user_${userId}`, {
      userId,
      startDate,
      endDate,
      expireTime,
      startTime,
    });
  };

  const check = (userId) => {
    const now = new Date().getTime();
    const data = getLocal(`user_${userId}`);

    if (!data) {
      return false;
    }

    const elapsed = now - data.startTime;
    console.log(dayjs(now).format('DD/MM/YYYY HH:mm'));
    console.log(dayjs(data.expireTime).format('DD/MM/YYYY HH:mm'));
    console.log(dayjs(data.startTime).format('DD/MM/YYYY HH:mm'));

    return elapsed <= data.expireTime - data.startTime;
  };

  React.useEffect(() => {
    let userData = getLocal(`user_${id}`);

    if (!userData) {
      const startTime = new Date().getTime();
      register(id, '28-12-2025', '30-12-2025', 180, startTime);
      userData = getLocal(`user_${id}`);
    }

    setTimeout(
      () => {
        console.log('sau 1p:', check(id));
      },
      1 * 60 * 1000
    );

    setTimeout(
      () => {
        console.log('sau 2p:', check(id));
      },
      2 * 60 * 1000
    );

    setTimeout(
      () => {
        console.log('sau 3p:', check(id));
      },
      3 * 60 * 1000
    );
  }, []);

  return <div>{check(id)}</div>;
};

export default PageOne;
