import { useEffect, useState } from 'react';
import { networkManager } from '@/lib/network/network';
import { jwtDecode } from 'jwt-decode';
import { jwtToAddress } from '@mysten/zklogin';
import { usePathname } from 'next/navigation';
import { hash } from '@/lib/utils/string';

export function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    setIsLogin(window.sessionStorage.getItem('USER_DOC_ID') !== null);
  }, []);

  useEffect(() => {
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
          alert(err);
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
  }, [pathName]);

  const handleGoogleLogin = async () => {
    const { sk, randomness, exp, url } =
      await networkManager.openIdConnectUrl();
    window.sessionStorage.setItem('EPK_SECRET', sk);
    window.sessionStorage.setItem('RANDOMNESS', randomness);
    window.sessionStorage.setItem('EXPIRED_AT', exp.toString());
    window.location.replace(url);
  };

  const handleDisconnect = () => {
    window.sessionStorage.removeItem('USER_DOC_ID');
    window.sessionStorage.removeItem('SUI_ACCOUNT');
    setIsLogin(false);
  };

  return {
    isLogin,
    handleGoogleLogin,
    handleDisconnect,
  };
}
