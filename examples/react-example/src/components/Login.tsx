import { useState } from "react";

function Login() {
  const [displayName, setDisplayName] = useState("");

  return (
    <div className="h-screen w-full flex items-center flex-col justify-center">
      <input
        type="text"
        placeholder="Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="border rounded py-2 px-4"
      />
      <button>Start</button>
    </div>
  );
}

export default Login;
