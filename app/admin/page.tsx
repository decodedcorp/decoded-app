"use client";

import { FirebaseHelper } from "@/common/firebase";
import { custom_font, validateEmail } from "@/components/helpers/util";
import { useState } from "react";
import { useRouter } from "next/navigation";

function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      alert("Invalid email format");
      return;
    }
    FirebaseHelper.adminLogin(email, password).then((isAdmin) => {
      if (isAdmin) {
        router.push("/dashboard");
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
          className="input input-bordered w-full max-w-xs"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="input input-bordered w-full max-w-xs mt-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="btn btn-primary mt-5">
          Login
        </button>
      </div>
    </div>
  );
}

export default page;
