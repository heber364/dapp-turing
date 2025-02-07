'use client'
import { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}

import {ethers}  from 'ethers'
import TuringArtifact from '../../services/hardhat/artifacts/Turing.sol/Turing.json'
const TURING_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const LOCAL_BLOCKCHAIN_URL = 'http://localhost:8545'

export default function Home() {
  const [codename, setCodename] = useState("");
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [turings, setTurings] = useState("");
  const [ranking, setRanking] = useState([
    { codename: "Alice", turings: 100 },
    { codename: "Bob", turings: 80 },
    { codename: "Charlie", turings: 50 },
  ]);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(LOCAL_BLOCKCHAIN_URL);
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    setSigner(provider.getSigner());
  }, []);

  async function _intializeContract(init: any) {
    const contract = new ethers.Contract(
      TURING_ADDRESS,
      TuringArtifact.abi,
      init
    );
    return contract
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function issueToken() {
    if (typeof window.ethereum !== 'undefined') {

      await requestAccount()

      const contract = await _intializeContract(signer)

      const transaction = await contract.issueToken(codename, turings);

      await transaction.wait();

      console.log(`${turings} Turing has been sent to ${codename}`);

    }
  }

  async function vote() {
    if (typeof window.ethereum !== 'undefined') {

      await requestAccount()

      const contract = await _intializeContract(signer)

      const transaction = await contract.vote(codename, turings);

      await transaction.wait();

      console.log(`$Vote has been started`);

    }
  }

  async function votingOn() {
    if (typeof window.ethereum !== 'undefined') {

      await requestAccount()

      const contract = await _intializeContract(signer)

      const transaction = await contract.votingOn();

      await transaction.wait();

      console.log(`$Vote has been started`);

    }
  }

  async function votingOff() {
    if (typeof window.ethereum !== 'undefined') {

      await requestAccount()

      const contract = await _intializeContract(signer)

      const transaction = await contract.votingOff();

      await transaction.wait();

      console.log(`$Vote has been ended`);

    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">DApp - Gestão de Turings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2">Insira um Codenome:</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
        >

        </input>

        <label className="block mb-2">Quantidade de Turings:</label>
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          value={turings}
          onChange={(e) => setTurings(e.target.value)}
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded mb-2 hover:bg-blue-600"
        onClick={() => issueToken()}>
          Issue Token
        </button>
        <button className="w-full bg-green-500 text-white py-2 rounded mb-2 hover:bg-green-600"
        onClick={() => vote()}>
          Vote
        </button>
        <button className="w-full bg-yellow-500 text-white py-2 rounded mb-2 hover:bg-yellow-600"
        onClick={() => votingOn()}>
          Voting On
        </button>
        <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
         onClick={() => votingOff()}>
          Voting Off
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Ranking de Usuários</h2>
        <ul>
          {ranking.map((user, index) => (
            <li key={index} className="flex justify-between py-2 border-b">
              <span>{user.codename}</span>
              <span>{user.turings} Turings</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

