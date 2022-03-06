# Hardhat Project with TypeScript

This project demonstrates a basic Hardhat use case using typescript. It comes with a sample contract and a test for that contract. It is configured to work with `hardhat-deploy` plugin for intuitive contract deployment. And, `hardhat-etherscan` for contract verification. Beyond those the project also comes with example script and tasks.

Try running some of the following tasks:

Start with installing dependencies

```shell
yarn install
```

Add required environment variables. I recommend using https://direnv.net/. If you are using direnv, create `.envrc` file and add the variables below.

```
export HARDHAT_TARGET_NETWORK=localhost
export REPORT_GAS=1
export ETHERSCAN_API_KEY=XXXX
export INFURA_ID=XXXX
```

Then, start local hardhat chain

```shell
yarn chain
```

Run the test, get test coverage, compile and deploy

```shell
yarn test
yarn coverage
yarn build
yarn deploy
```

Create a folder called `generated` at the root of the project. Then, generate and show account. This code is copy-pasted from scaffold-eth project.

```shell
yarn generate
yarn account
```

Deploy to testnet and verify. Sometimes you will need `clean` to force re-compilation for deployment or verification.

```shell
yarn clean
yarn deploy --network rinkeby
yarn verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```
