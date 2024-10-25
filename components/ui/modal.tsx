"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { networkManager } from "@/common/network";
import { Button } from "@/components/ui/button";
import { jwtToAddress } from "@mysten/zklogin";
import { hash } from "@/common/util";

export const LoginModal = ({
  setIsLogin,
}: {
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathName = usePathname();

  useEffect(() => {
    const login = async (token: string) => {
      const decoded_jwt = jwtDecode(token);
      const sub = decoded_jwt.sub;
      const iss = decoded_jwt.iss;
      const aud = decoded_jwt.aud;
      if (sub && iss && aud) {
        try {
          const res = await networkManager.request(
            "login?id=" + hash(sub + iss + aud),
            "GET",
            {}
          );
          const sui_acc = jwtToAddress(token, res.data.salt);
          setIsLogin(true);
          window.sessionStorage.setItem("USER_DOC_ID", res.data.user);
          window.sessionStorage.setItem("SUI_ACCOUNT", sui_acc);
        } catch (error) {
          alert("Something went wrong. Contact support [support@decoded]");
          setIsLogin(false);
        } finally {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    };
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const token = params.get("id_token");
      if (token) {
        login(token);
      }
    }
  }, [pathName]);

  return (
    <dialog id="login-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-2xl">Login</h3>
        <div className="modal-action items-center">
          <Button
            style={{
              backgroundColor: "#4285f4",
            }}
            variant="default"
            onClick={async () => {
              const { sk, randomness, exp, url } =
                await networkManager.openIdConnectUrl();
              window.sessionStorage.setItem("EPK_SECRET", sk);
              window.sessionStorage.setItem("RANDOMNESS", randomness);
              window.sessionStorage.setItem("EXPIRED_AT", exp.toString());
              window.location.replace(url);
            }}
          >
            Sign In With Google
          </Button>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
