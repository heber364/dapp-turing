"use client";
import {  useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}

import { ethers } from "ethers";
import TuringArtifact from "../../services/hardhat/artifacts/Turing.sol/Turing.json";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/helper/getErrorMessage";
const TURING_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

type User = { codename: string; address: string; turing: number };

export default function Home() {
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);

  const [codename, setCodename] = useState("");
  const [turings, setTurings] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [codenames, setCodenames] = useState<string[]>([]);
  useEffect(() => {
    const initialize = async () => {
      if (!window.ethereum) {
        toast.error("Por favor, instale a extensão Metamask.");
        return
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = newProvider.getSigner();
;
      setProvider(newProvider);
      setSigner(newSigner);
      const newContract = new ethers.Contract(
        TURING_ADDRESS,
        TuringArtifact.abi,
        newSigner
      );
      setContract(newContract);
      getUsers(newContract);
      listenForVoteEvents(newContract)
      listenForIssueTokenEvents(newContract)
    };
    initialize();
  }, []);


  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  function listenForVoteEvents(contract: any) {
    contract.on("VoteCast", async () => {
      getUsers(contract);
    });
  };
  function listenForIssueTokenEvents(contract: any) {
    contract.on("IssueTokenCast", async () => {
      getUsers(contract);
    });
  };


  async function getUsers(contract: any) {
    try {
      const [names, addresses, balances] = await contract.getAddressesAndBalances();

      const formattedUsers: User[] = addresses.map((recipient: any, index: number) => ({
        codename: names[index],
        addresses: recipient,
        turing: parseFloat(ethers.utils.formatEther(balances[index])),
      }));

      setCodenames(formattedUsers.map((user) => user.codename));
      setCodename(formattedUsers[0].codename);
      formattedUsers.sort((a: User, b: User) => b.turing - a.turing);

      setUsers(formattedUsers);
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage ?? "Ocorreu um erro desconhecido.");
      console.log(error)

    }

  }

  async function issueToken() {
    try {
      if (!window.ethereum) {
        toast.error("Por favor, instale a extensão Metamask.");
        return
      }
      await requestAccount();
      const saturings = ethers.utils.parseUnits(turings.toString(), 18);
      const transaction = await contract.issueToken(codename, saturings);
      await transaction.wait();
      toast.success("Turings emitidos.");
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage ?? "Ocorreu um erro desconhecido.");
      console.log(error)
    }
  }

  async function vote() {
    try {
      if (!window.ethereum) {
        toast.error("Por favor, instale a extensão Metamask.");
        return
      }
      await requestAccount();
      const saturings = ethers.utils.parseUnits(turings.toString(), 18);
      const transaction = await contract.vote(codename, saturings);
      await transaction.wait();
      toast.success("Votação realizada.");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage ?? "Ocorreu um erro desconhecido.");
      console.log(JSON.stringify(error))
    }

  }

  async function votingOn() {
    try {
      if (!window.ethereum) {
        toast.error("Por favor, instale a extensão Metamask.");
        return
      }
      await requestAccount();
      const transaction = await contract.votingOn();
      await transaction.wait();
      toast.success("Votação habilitada.");
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage ?? "Ocorreu um erro desconhecido.");
      console.log(error)
    }
  }

  async function votingOff() {
    try {
      if (!window.ethereum) {
        toast.error("Por favor, instale a extensão Metamask.");
        return
      }
      await requestAccount();
      const transaction = await contract.votingOff();
      await transaction.wait();
      toast.success("Votação desabilitada.");
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage ?? "Ocorreu um erro desconhecido.");
      console.log(error)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center py-10">
    <h1 className="text-3xl font-semibold mb-6 text-gray-700">Votação - Turing</h1>
    <div className="flex gap-8 items-start p-6 w-full max-w-4xl">
      
      {/* Formulário */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <label className="block mb-2 text-gray-600 font-medium">Selecione um codinome:</label>
        {/* <input
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-300 mb-4"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
        /> */}
        <select
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-300 mb-4"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
        >
          {codenames.map((codename) => (
            <option key={codename} value={codename}>{codename}</option>
          ))}
        </select>
  
        <label className="block mb-2 text-gray-600 font-medium">Quantidade de Turings:</label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-300 mb-4"
          value={turings}
          onChange={(e) => setTurings(e.target.value)}
        />
  
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg mb-2 hover:bg-blue-600 transition" onClick={() => issueToken()}>
          Emitir Token
        </button>
        <button className="w-full bg-green-500 text-white py-2 rounded-lg mb-2 hover:bg-green-600 transition" onClick={() => vote()}>
          Votar
        </button>
        <button className="w-full bg-yellow-500 text-white py-2 rounded-lg mb-2 hover:bg-yellow-600 transition" onClick={() => votingOn()}>
          Iniciar Votação
        </button>
        <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition" onClick={() => votingOff()}>
          Encerrar Votação
        </button>
      </div>
  
      {/* Ranking */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-medium mb-4 text-gray-700">Ranking de Usuários</h2>
        <ul>
          {users ? users.map((user, index) => (
            <li key={index} className="flex justify-between py-2 border-b last:border-none text-gray-600">
              <span>{user.codename}</span>
              <span className="font-medium">{user.turing} Turings</span>
            </li>
          )): <span>Carregando...</span>}
        </ul>
      </div>
  
    </div>
  </div>
  

  );
}
