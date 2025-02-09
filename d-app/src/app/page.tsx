"use client";
import { useEffect, useState } from "react";

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

const LOCAL_BLOCKCHAIN_URL = "http://127.0.0.1:8545";



export default function Home() {
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);

  const [codename, setCodename] = useState("");
  const [turings, setTurings] = useState("");
  const [users, setUsers] = useState<{ codename: string; address: string; turing: string }[]>([]);

  useEffect(() => {
    const initialize = async () => {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      //const newProvider = new ethers.providers.JsonRpcProvider(LOCAL_BLOCKCHAIN_URL);
      const newSigner = newProvider.getSigner();
      console.log(newSigner);
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
    contract.on("VoteCast", async (recipient: any, codinome: any, saTurings: any) => {
      console.log("Evento VoteCast recebido:", {
        recipient,
        codinome,
        saTurings
      });
      getUsers(contract);
    });
  };
  function listenForIssueTokenEvents(contract: any) {
    contract.on("IssueTokenCast", async (recipient: any, codinome: any, saTurings: any) => {
      console.log("Evento IssueTokenCast recebido:", {
        recipient,
        codinome,
        saTurings
      });
      getUsers(contract);
    });
  };


  async function getUsers(contract: any) {
    try {
      const [names, addresses, balances] = await contract.getAddressesAndBalances();

      const formattedParticipants = addresses.map((recipient: any, index: number) => ({
        codename: names[index],
        addresses: recipient,
        turing: parseFloat(ethers.utils.formatEther(balances[index])), // Convertendo para número
      }));

      // Ordenar do maior para o menor saldo de turing
      formattedParticipants.sort((a: any, b: any) => b.turing - a.turing);

      setUsers(formattedParticipants);
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage ?? "Ocorreu um erro desconhecido.");
      console.log(error)

    }

  }

  async function issueToken() {
    try {
      await requestAccount();
      const transaction = await contract.issueToken(codename, turings);
      await transaction.wait();
      toast.success("Turings enviados.");
      console.log(`${turings} Turing has been sent to ${codename}`);
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage ?? "Ocorreu um erro desconhecido.");
      console.log(error)
    }
  }

  async function vote() {
    try {
      await requestAccount();
      const transaction = await contract.vote(codename, turings);
      await transaction.wait();
      toast.success("Votação realizada.");
      console.log(transaction);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage ?? "Ocorreu um erro desconhecido.");
      console.log(JSON.stringify(error))
    }

  }

  async function votingOn() {
    try {
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">DApp - Gestão de Turings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">

        <label className="block mb-2">Insira um Codenome:</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
        ></input>

        <label className="block mb-2">Quantidade de Turings:</label>
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          value={turings}
          onChange={(e) => setTurings(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mb-2 hover:bg-blue-600"
          onClick={() => issueToken()}
        >
          Issue Token
        </button>
        <button
          className="w-full bg-green-500 text-white py-2 rounded mb-2 hover:bg-green-600"
          onClick={() => vote()}
        >
          Vote
        </button>
        <button
          className="w-full bg-yellow-500 text-white py-2 rounded mb-2 hover:bg-yellow-600"
          onClick={() => votingOn()}
        >
          Voting On
        </button>
        <button
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          onClick={() => votingOff()}
        >
          Voting Off
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Ranking de Usuários</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="flex justify-between py-2 border-b">
              <span>{user.codename}</span>
              <span>{user.turing} Turings</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
