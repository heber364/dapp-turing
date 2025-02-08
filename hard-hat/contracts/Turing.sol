// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Turing is ERC20 {
    address private owner;
    address private professor;
    bool private votingEnabled;
    uint256 private constant turing = 1e18;
    uint private constant MAX_VOTES = 2;

    string[18] codenames;
    mapping(address => bool) private isAuthorized;
    mapping(string => address) private codenameToAddress;
    mapping(address => uint) private totalVotes;
    mapping(address => mapping(address => bool)) private hasVotedFor;

    string constant ERR_NOT_AUTHORIZED =
        "Usuario nao autorizado a executar esta acao.";
    string constant ERR_VOTING_DISABLED =
        "A votacao esta desativada no momento.";
    string constant ERR_VOTE_LIMIT_REACHED =
        "Voce ja utilizou todos os seus votos disponiveis.";
    string constant ERR_NOT_A_VALID_USER =
        "Acao invalida: o codinome nao eh de um usuario valido.";
    string constant ERR_CANNOT_VOTE_SELF = "Voce nao pode votar em si mesmo.";
    string constant ERR_DUPLICATE_VOTE =
        "Voto invalido: nao eh permitido votar duas vezes no mesmo candidato.";
    string constant ERR_MAX_TURINGS_EXCEEDED =
        "Limite excedido: o maximo permitido eh 2 Turings.";
    string constant ERR_ONLY_OWNER_OR_PROFESSOR =
        "Apenas o owner ou a professora podem executar esta acao.";

    event VoteCast(address recipient, string codename, uint256 amount);
    event IssueTokenCast(address recipient, string codename, uint256 amount);

    constructor() ERC20("Turing Token", "TUR") {
        professor = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Segundo endereço 
        owner = msg.sender; // Primeiro endereço
        votingEnabled = true;

        codenames = [
            "nome1",
            "nome2",
            "nome3",
            "nome4",
            "nome5",
            "nome6",
            "nome7",
            "nome8",
            "nome9",
            "nome10",
            "nome11",
            "nome12",
            "nome13",
            "nome14",
            "nome15",
            "nome16",
            "nome17",
            "nome18"
        ];

        address[18] memory addresses = [
            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,
            0x90F79bf6EB2c4f870365E785982E1f101E93b906,
            0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,
            0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc,
            0x976EA74026E726554dB657fA54763abd0C3a0aa9,
            0x14dC79964da2C08b23698B3D3cc7Ca32193d9955,
            0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f,
            0xa0Ee7A142d267C1f36714E4a8F75612F20a79720,
            0xBcd4042DE499D14e55001CcbB24a551F3b954096,
            0x71bE63f3384f5fb98995898A86B02Fb2426c5788,
            0xFABB0ac9d68B0B445fB7357272Ff202C5651694a,
            0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec,
            0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097,
            0xcd3B766CCDd6AE721141F452C550Ca635964ce71,
            0x2546BcD3c84621e976D8185a91A922aE77ECEc30,
            0xbDA5747bFD65F08deb54cb465eB87D40e51B197E,
            0xdD2FD4581271e230360230F9337D5c0430Bf44C0,
            0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
        ];

        for (uint i = 0; i < codenames.length; i++) {
            isAuthorized[addresses[i]] = true;
            codenameToAddress[codenames[i]] = addresses[i];
            totalVotes[addresses[i]] = 0;
        }
    }

    function getAddressesAndBalances()
        external
        view
        returns (string[] memory, address[] memory, uint256[] memory)
    {
        uint256 length = 18;
        address[] memory addresses = new address[](length);
        uint256[] memory balances = new uint256[](length);
        string[] memory names = new string[](length);

        for (uint i = 0; i < length; i++) {
            address addr = codenameToAddress[codenames[i]];
            addresses[i] = addr;
            balances[i] = balanceOf(addr);
            names[i] = codenames[i];
        }

        return (names, addresses, balances);
    }

    function issueToken(
        string memory codename,
        uint256 qtd
    ) external onlyOwnerOrProfessor {
        address recipient = codenameToAddress[codename];
        require(recipient != address(0), ERR_NOT_A_VALID_USER);

        uint256 saTurings = qtd * turing;
        _mint(recipient, saTurings);
        emit VoteCast(recipient, codename, saTurings);
    }

    function vote(string memory codename, uint256 qtd) public {
        require(
            isAuthorized[msg.sender] == true || msg.sender == owner,
            ERR_NOT_AUTHORIZED
        );
        require(votingEnabled, ERR_VOTING_DISABLED);
        require(totalVotes[msg.sender] < MAX_VOTES, ERR_VOTE_LIMIT_REACHED);
        address recipient = codenameToAddress[codename];
        require(recipient != address(0), ERR_NOT_A_VALID_USER);
        require(recipient != msg.sender, ERR_CANNOT_VOTE_SELF);

        require(!hasVotedFor[msg.sender][recipient], ERR_DUPLICATE_VOTE);

        uint256 saTurings = qtd * turing;
        require(saTurings <= 2 * turing, ERR_MAX_TURINGS_EXCEEDED);

        _mint(recipient, saTurings);
        _mint(msg.sender, saTurings / 5); //0.2 * 10^18 = 0.2 TUR

        totalVotes[msg.sender] += 1;
        hasVotedFor[msg.sender][recipient] = true;

        emit VoteCast(recipient, codename, saTurings);
    }

    function votingOn() external onlyOwnerOrProfessor {
        votingEnabled = true;
    }

    function votingOff() external onlyOwnerOrProfessor {
        votingEnabled = false;
    }

    modifier onlyOwnerOrProfessor() {
        require(
            msg.sender == owner || msg.sender == professor,
            ERR_ONLY_OWNER_OR_PROFESSOR
        );
        _;
    }
}
