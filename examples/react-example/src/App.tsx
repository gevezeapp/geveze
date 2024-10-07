import { useState } from "react";
import Channels from "./components/Channels";
import Chat from "./components/Chat";
import Users from "./components/Users";
import { GevezeProvider } from "@geveze/react";
import * as jose from "jose";

const PROJECT_KEY = "X4tP4RnHCU";
const PROJECT_SECRET = "5J3nIbbPMCdaNBClAD5m99rjNFTSJS2T";

function App() {
  const [displayName, setDisplayName] = useState("");
  const [token, setToken] = useState<null | string>(null);
  const [channel, setChannel] = useState<string>();

  const generateToken = async () => {
    const secret = new TextEncoder().encode(PROJECT_SECRET);
    const jwt = await new jose.SignJWT({
      displayName: displayName,
      id: (Math.random() * 99999).toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
    setToken(jwt);
  };

  if (!token)
    return (
      <div className="h-screen w-full flex items-center flex-col justify-center">
        <input
          type="text"
          placeholder="Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border rounded py-2 px-4"
        />
        <button onClick={generateToken}>Start</button>
      </div>
    );

  return (
    <GevezeProvider project={PROJECT_KEY} token={token}>
      <main className="flex w-full h-screen max-h-screen">
        <Channels onSelectChannel={(channel) => setChannel(channel)} />
        {channel ? (
          <Chat channel={channel} />
        ) : (
          <div className="grow flex flex-col justify-between"></div>
        )}
        <Users onSelectChannel={(channel) => setChannel(channel)} />
      </main>
    </GevezeProvider>
  );
}

export default App;
