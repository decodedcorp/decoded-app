import { useEffect, useState } from 'react';
import { networkManager } from '@/lib/network/network';
import { jwtDecode } from 'jwt-decode';
import { jwtToAddress } from '@mysten/zklogin';
import { usePathname } from 'next/navigation';
import { hash } from '@/lib/utils/string/string';

export function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const checkInitialState = () => {
      const isUserLoggedIn = window.sessionStorage.getItem('USER_DOC_ID') !== null;
      setIsLogin(isUserLoggedIn);
      setIsInitialized(true);
    };

    checkInitialState();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const hashTag = window.location.hash;
    const login = async (token: string) => {
      const decoded_jwt = jwtDecode(token);
      const sub = decoded_jwt.sub;
      const iss = decoded_jwt.iss;
      const aud = decoded_jwt.aud;
      if (sub && iss && aud) {
        try {
          const res = await networkManager.request(
            `user/${hash(sub + iss + aud)}/login`,
            'GET',
            {}
          );
          const sui_acc = jwtToAddress(token, res.data.salt);
          const user_doc_id = res.data.user;
          const _ = await networkManager.request(
            `user/${user_doc_id}?aka=${sui_acc}`,
            'POST'
          );
          window.sessionStorage.setItem('USER_DOC_ID', user_doc_id);
          window.sessionStorage.setItem('SUI_ACCOUNT', sui_acc);
          setIsLogin(true);
        } catch (err) {
          console.error('Login error:', err);
        } finally {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    if (hashTag) {
      const params = new URLSearchParams(hashTag.substring(1));
      const token = params.get('id_token');
      if (token) {
        login(token);
      }
    }
  }, [pathName, isInitialized]);

  const handleGoogleLogin = async () => {
    if (!isInitialized) return;
    
    try {
      const { sk, randomness, exp, url } = await networkManager.openIdConnectUrl();
      window.sessionStorage.setItem('EPK_SECRET', sk);
      window.sessionStorage.setItem('RANDOMNESS', randomness);
      window.sessionStorage.setItem('EXPIRED_AT', exp.toString());
      window.location.replace(url);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleDisconnect = () => {
    if (!isInitialized) return;
    
    window.sessionStorage.removeItem('USER_DOC_ID');
    window.sessionStorage.removeItem('SUI_ACCOUNT');
    setIsLogin(false);
  };

  return {
    isLogin,
    isInitialized,
    handleGoogleLogin,
    handleDisconnect,
  };
}
