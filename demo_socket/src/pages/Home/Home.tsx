import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';
import { Storage } from '@/constants/storage';
import { UrlInternal } from '@/constants/url-internal';
import classNames from 'classnames/bind';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setCookie } from 'simplize-component';
import styles from './styles.module.scss';
const cx = classNames.bind(styles);

const Home: React.FC = (): JSX.Element => {
  const navigate = useNavigate();

  const enterApp = (url: string) => {
    setCookie(Storage.token, 'demo-token');
    navigate(url);
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('snow')}>
        <div className={cx('stars1')}></div>
        <div className={cx('stars2')}></div>
      </div>

      <div className={cx('login')}>
        <div className={cx('container')}>
          <div className={cx('colLeft')}>
            <div className={cx('logo')} />

            <div className={cx('wrapperMenu')}>
              <div className={cx('menuIcon')}>
                <div>
                  <FacebookIcon width={50} height={50} />
                </div>
                <div>
                  <TwitterIcon width={50} height={50} />
                </div>
                <div>
                  <LinkedInIcon width={50} height={50} />
                </div>
              </div>
            </div>

            <p className={cx('or')}>OR</p>

            <input className={cx('input')} placeholder="Email Address" />
            <input className={cx('input')} placeholder="Password" />

            <p className={cx('link')}>Forgot password</p>

            <button
              className={cx('btnLogin')}
              onClick={() => enterApp(UrlInternal.PRODUCT)}
            >
              login
            </button>

            <p className={cx('text')}>
              Don't have an account?
              <span onClick={() => enterApp(UrlInternal.CHAT)}>Register</span>
            </p>
          </div>
          <div className={cx('colRight')}></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
