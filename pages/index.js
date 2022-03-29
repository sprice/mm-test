import React from "react";
import { useAccount, useConnect } from "wagmi";

const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
};

export default function Home() {
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  const isMounted = useIsMounted();

  return (
    <div>
      <div>
        {connectData.connectors.map((connector) => (
          <button
            disabled={isMounted && !connector.ready}
            key={connector.id}
            onClick={() => connect(connector)}
          >
            {isMounted && connector.name}
            {isMounted && !connector.ready && " (unsupported)"}
          </button>
        ))}

        {connectError && (
          <div>{connectError?.message ?? "Failed to connect"}</div>
        )}
      </div>
      {accountData && (
        <div>
          <img src={accountData.ens?.avatar} alt="ENS Avatar" />
          <div>
            {accountData.ens?.name
              ? `${accountData.ens?.name} (${accountData.address})`
              : accountData.address}
          </div>
          <div>Connected to {accountData.connector.name}</div>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
