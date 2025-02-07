const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Turing Token Contract", function () {
  let Turing, contract, owner, professor, user1, user2, unauthorized;
  
  beforeEach(async function () {
    unauthorized = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
    
    Turing = await ethers.getContractFactory("Turing");
    contract = await Turing.deploy();    

   professor = await contract.professor();
    user1 = await contract.codenameToAddress("nome1");
    user2 = await contract.codenameToAddress("nome2");
  });

  it("Deve inicializar corretamente", async function () {
    expect(await contract.name()).to.equal("Turing Token");
    expect(await contract.symbol()).to.equal("TUR");
  });

  it("Apenas owner ou professor podem emitir tokens", async function () {
    await expect(
      contract.connect(unauthorized).issueToken("nome1", 1)
    ).to.be.revertedWith("Apenas o owner ou a professora podem executar esta acao");
  });

  it("Usuário autorizado pode votar", async function () {
    await contract.connect(user1).vote("nome2", 1);
    expect(await contract.balanceOf(address2)).to.equal(ethers.utils.parseEther("1"));
  });

  it("Usuário não autorizado não pode votar", async function () {
    await expect(
      contract.connect(unauthorized).vote("nome1", 1)
    ).to.be.revertedWith("Usuario nao autorizado");
  });

  it("Usuário não pode votar em si mesmo", async function () {
    await expect(
      contract.connect(user1).vote("nome1", 1)
    ).to.be.revertedWith("Nao pode votar em si mesmo");
  });

  it("Usuário não pode votar mais de duas vezes", async function () {
    await contract.connect(user1).vote("nome2", 1);
    await contract.connect(user1).vote("nome3", 1);
    await expect(
      contract.connect(user1).vote("nome4", 1)
    ).to.be.revertedWith("Voce ja usou todos os seus votos");
  });

  it("Votação pode ser desativada", async function () {
    await contract.connect(owner).votingOff();
    await expect(
      contract.connect(user1).vote("nome2", 1)
    ).to.be.revertedWith("A votacao esta desativada");
  });
});
