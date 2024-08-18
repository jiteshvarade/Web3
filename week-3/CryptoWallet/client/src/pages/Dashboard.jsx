import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Buffer } from "buffer";
import { SERVER_URL, ETH_URL } from "../../constants.mjs";
import background from "../assets/LandingPage/HeroSection.mp4";

window.Buffer = Buffer;

function Dashboard() {
  const location = useLocation();
  const email = location.state?.email;
  const name = location.state?.name;

  const [showModal, setShowModal] = useState(false);
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const getAccounts = async () => {
    const res = await fetch(`${SERVER_URL}/dashboard/getAccounts/${email}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      setAccounts(data.accounts);
    } else {
      toast.error("Failed to get accounts");
    }
  };

  const handleCreateWallet = async () => {
    if (password === "" || confirmPassword === "") {
      toast.error("Please enter and confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const res = await fetch(`${SERVER_URL}/dashboard/createAccount/${email}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      toast.success("Wallet created successfully");
      setRecoveryPhrase(data.mnemonic);
      setPrivateKey(data.privateKey);
      setPublicKey(data.publicKey);
      setShowRecoveryPhrase(true);
      getAccounts();
    } else {
      toast.error("Failed to create wallet");
    }
  };

  const handleGetBalance = async (publicKey, index) => {
    const res = await fetch(`${ETH_URL}`, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [publicKey, "latest"],
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      const balanceInEth = parseInt(data.result, 16) / 1e18;
      const updatedAccounts = [...accounts];
      updatedAccounts[index].balance = balanceInEth.toFixed(4);
      setAccounts(updatedAccounts);
      toast.success(`Balance fetched for Account ${index + 1}`);
    } else {
      toast.error(`Failed to fetch balance for Account ${index + 1}`);
    }
  };

  useEffect(() => {
    const ws = new WebSocket(SERVER_URL);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      try {
        const transaction = JSON.parse(event.data);
        setTransactions((prevTransactions) => [transaction, ...prevTransactions]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      setPassword("");
      setConfirmPassword("");
      setShowRecoveryPhrase(false);
    }
  }, [showModal]);

  useEffect(() => {
    getAccounts();
  }, [email]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6">
      <video
        autoPlay
        muted
        loop
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src={background} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-10 right-10 text-white text-xl font-bold z-10">
        Welcome, {name || "User"}!
      </div>

      <div className="flex space-x-4 mb-6 relative z-10">
        <button
          className="px-6 py-3 bg-green-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
          onClick={() => setShowModal(true)}
        >
          Create Wallet
        </button>
        <button className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition">
          Import Wallet
        </button>
      </div>

      <div className="w-full max-w-6xl flex space-x-6 relative z-10">
        <div className="w-1/2 max-h-96 overflow-y-auto">
          <h2 className="text-2xl mb-4 text-white">Your Accounts</h2>
          <div className="space-y-4 text-white">
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <div
                  key={account._id}
                  className="p-4 bg-gray-800 rounded-lg shadow-md"
                >
                  <p>
                    <strong>Account {index + 1}:</strong>
                  </p>
                  <p className="break-words">
                    <strong>Private Key:</strong> {account.privateKey}
                  </p>
                  <p className="break-words mt-2">
                    <strong>Public Key:</strong> {account.publicKey}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
                    onClick={() => handleGetBalance(account.publicKey, index)}
                  >
                    Get Balance
                  </button>
                  {account.balance !== undefined && (
                    <p className="mt-2">
                      <strong>Balance:</strong> {account.balance} ETH
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No accounts found.</p>
            )}
          </div>
        </div>

        <div className="w-1/2 max-h-96 overflow-y-auto">
          <h2 className="text-2xl mb-4 text-white">Live Transactions On BlockChain</h2>
          <div className="space-y-4 text-white">
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg shadow-md"
                >
                  <p>
                    <strong>BlockNumber {tx.blockNumber}:</strong>
                  </p>
                  <p className="break-words">
                    <strong>Hash:</strong> {tx.hash}
                  </p>
                  <p className="break-words mt-2">
                    <strong>From:</strong> {tx.from}
                  </p>
                  <p className="break-words mt-2">
                    <strong>To:</strong> {tx.to}
                  </p>
                  <p className="mt-2">
                    <strong>Value:</strong> {parseInt(tx.value, 16) / 1e18} ETH
                  </p>
                </div>
              ))
            ) : (
              <p>No live transactions.</p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 w-80 rounded-lg shadow-lg overflow-y-auto">
            <h2 className="text-white text-xl mb-4">Create Wallet</h2>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 text-black rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 mb-4 text-black rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!showRecoveryPhrase ? (
              <>
                <button
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={handleCreateWallet}
                >
                  Create Wallet
                </button>
                <button
                  className="w-full px-4 py-2 mt-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <div>
                <h3 className="text-white text-lg mb-2">Recovery Phrase</h3>
                <p className="text-white mb-4">{recoveryPhrase}</p>
                <p className="text-white mb-4">
                  <strong>Private Key:</strong> {privateKey}
                </p>
                <p className="text-white mb-4">
                  <strong>Public Key:</strong> {publicKey}
                </p>
                <button
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
