"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { networkManager } from "@/common/network";
import { Button } from "@/components/ui/button";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  generateRandomness,
  generateNonce,
  jwtToAddress,
} from "@mysten/zklogin";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

export const LoginModal = ({
  setIsLogin,
}: {
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathName = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    const login = async (token: string) => {
      const decoded_jwt = jwtDecode(token);
      const sub = decoded_jwt.sub;
      const iss = decoded_jwt.iss;
      const aud = decoded_jwt.aud;
      if (sub && iss && aud) {
        try {
          const res = await networkManager.handleCreateDoc("user", {
            sub: sub,
            iss: iss,
            aud: aud,
          });
          const address = jwtToAddress(token, res.data.salt);
          setIsLogin(true);
          window.sessionStorage.setItem("USER_DOC_ID", res.data.docId);
          window.sessionStorage.setItem("SUI_ADDRESS", address);
        } catch (error) {
          setIsLogin(false);
        } finally {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    };
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
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
              const epk = Ed25519Keypair.generate();
              window.sessionStorage.setItem("EPK_SECRET", epk.getSecretKey());
              const randomness = generateRandomness();
              window.sessionStorage.setItem("RANDOMNESS", randomness);
              const rpcUrl = getFullnodeUrl("devnet");
              const suiClient = new SuiClient({
                url: rpcUrl,
              });
              const suiSysState = await suiClient.getLatestSuiSystemState();
              const currentEpoch = suiSysState.epoch;
              let maxEpoch: number = parseInt(currentEpoch) + 10;
              const nonce = generateNonce(
                epk.getPublicKey(),
                maxEpoch,
                randomness
              );
              console.log(nonce);
              const params = new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID!,
                redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
                response_type: "id_token",
                scope: "openid",
                nonce: nonce,
              });
              const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
              window.location.replace(loginURL);
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
