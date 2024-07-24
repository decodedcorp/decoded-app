"use client";

import { Dispatch, SetStateAction } from "react";
import { FirebaseHelper } from "@/common/firebase";
import { bold_font, validateEmail } from "@/components/helpers/util";
import { useState } from "react";

function AdminLogin({
  params,
}: {
  params: {
    setIsLogin: Dispatch<SetStateAction<boolean>>;
  };
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      alert("Invalid email format");
      return;
    }
    FirebaseHelper.adminLogin(email, password).then((isAdmin) => {
      if (isAdmin) {
        params.setIsLogin(true);
      } else {
        alert("No Permission!");
      }
    });
  };

  return (
    <div className="flex flex-1 w-full h-screen items-center justify-center">
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="id"
          className="border border-black w-full max-w-xs bg-white p-3 fill-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="border border-black w-full max-w-xs mt-5 bg-white p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-white text-black border border-black mt-5"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
