import React, { useEffect, useState } from "react";
import axios from "axios";
import qrcode from "qrcode";
import "./App.scss";

export const App = () => {
  interface ICloudVaultConfig {
    ipDetails: {
      publicAddr: string;
      port: string;
      internalAddr?: string;
    };
    publicKey: string;
  }

  const [qr, setQr] = useState<string>();
  const [isSetup, setSetupStatus] = useState<boolean>(false);
  const [cloudvaultConfig, setCloudvaultConfig] = useState<ICloudVaultConfig>();

  useEffect(() => {
    const getSetupDetails = async () => {
      const { data }: { data: ICloudVaultConfig } = await axios.get(
        "/api/app",
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setCloudvaultConfig(() => data);
      const {
        ipDetails: { publicAddr, internalAddr, port },
        publicKey,
      } = data;
      const qrData = {
        type: "cloudvault",
        internalAddr,
        publicAddr,
        publicKey,
        port,
      };
      const qrInfoCode = await qrcode.toDataURL(JSON.stringify(qrData), {
        color: {
          light: "#FFFFFF",
          dark: "#4A5D6A",
        },
      });
      setQr(() => qrInfoCode);
    };

    getSetupDetails();
  }, []);

  return (
    <div className="App">
      <div className="qr-section">
        <h1>CloudVault</h1>
        {isSetup ? (
          <h2>
            Open the profiles tab in your Vira App to configure your vault
          </h2>
        ) : (
          <React.Fragment>
            <h2>SCAN WITH VIRA APP</h2>
            <p>
              Your CloudVault is a secure extension of your Vira App running on
              the cloud, your CloudVault can permission certain people or
              websites to be always able to access parts of your verifiable
              credentials as you wish.
              <br />
              <br />
              Scan the QR code with your Vira App by going to the profiles tab
              and continue the setup there. You will be asked to setup a user on
              your cloudvault and then you can proceed to setup your profiles.
            </p>
            {qr && <img src={qr} className="qr" />}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
