TODO: Desenvolvimento do contrato e funções

[X] Definir contrato ERC20 com nome "Turing" e unidade mínima "saTuring" (10^-18)

[X] Criar mapping (string => address) para arm azenar codinomes e endereços autorizados
[X] Criar mapping (address => uint) para armazenar quantidade de votos para cada usuario
[X] Criar mapping (address => mapping(address => address)) para relacionar qual usuário cada usuário votou

[X] Implementar modifier para restringir funções apenas ao owner e professora

[X] Criar função `issueToken(string memory codinome, uint256 quantidade)`
    - [X] Verificar se quem chama a função é o owner ou a professora
    - [X] Converter quantidade de TUR para saTurings
    - [X] Criar tokens para o endereço associado ao codinome

[X] Criar função `vote(string memory codinome, uint256 quantidade)`
    - [ ] Verificar se o usuário está autorizado a votar
    - [x] Verificar se a votação está ativa
    - [x] Verificar se o usuário já usou todos seus votos
    - [x] Verificar se o codinome é existe
    - [x] Verificar se o usuário não está votando em si mesmo
    - [x] Verificar se o usuário não está 2 vezes na mesma pessoa
    - [x] Verificar se a quantidade não ultrapassa 2 TUR (2 * 10^18 saTurings)
    - [x] Criar tokens para o endereço votado
    - [x] Criar 0,2 TUR para o votante como recompensa
    - [x] Incrementar a quantidade de votos do usuário
    - [x] Registrar voto do usuário a outro usuário

[X] Criar função `votingOn()` para ativar a votação (somente owner/professora)
[X] Criar função `votingOff()` para desativar a votação (somente owner/professora)

[ ] Emitir eventos nas funções `issueToken()` e `vote()` para rastrear transações

0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
0x90F79bf6EB2c4f870365E785982E1f101E93b906
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
0x976EA74026E726554dB657fA54763abd0C3a0aa9
0x14dC79964da2C08b23698B3D3cc7Ca32193d9955
0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
0xBcd4042DE499D14e55001CcbB24a551F3b954096
0x71bE63f3384f5fb98995898A86B02Fb2426c5788
0xFABB0ac9d68B0B445fB7357272Ff202C5651694a
0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec
0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097
0xcd3B766CCDd6AE721141F452C550Ca635964ce71
0x2546BcD3c84621e976D8185a91A922aE77ECEc30
0xbDA5747bFD65F08deb54cb465eB87D40e51B197E
0xdD2FD4581271e230360230F9337D5c0430Bf44C0
0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199