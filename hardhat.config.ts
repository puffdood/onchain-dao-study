import { task, HardhatUserConfig } from 'hardhat/config'
import { HardhatRuntimeEnvironment, HttpNetworkUserConfig } from 'hardhat/types'

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'

import '@typechain/hardhat'
import '@typechain/ethers-v5'

import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

import fs from 'fs'
import qrcode from 'qrcode-terminal'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task(
  'accounts',
  'Prints the list of accounts',
  async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
      console.log(account.address)
    }
  },
)

const mnemonicPath = './generated/mnemonic.secret'
const getMnemonic = (): string => {
  try {
    return fs.readFileSync(mnemonicPath).toString().trim()
  } catch (e) {
    if (process.env.HARDHAT_TARGET_NETWORK !== 'localhost') {
      console.log(
        '☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn generate` and then `yarn account`.',
      )
    }
  }
  return ''
}

const config: HardhatUserConfig = {
  defaultNetwork: process.env.HARDHAT_TARGET_NETWORK,
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: 'http://localhost:8545',
      chainId: 31337,
      /*
        if there is no mnemonic, it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // <---- YOUR ETHERSCAN API KEY
  },
  solidity: '0.8.8',
}
export default config

const DEBUG = true
function LOG_DEBUG(text: string): void {
  if (DEBUG) {
    console.log(text)
  }
}

task(
  'generate',
  'Create a mnemonic for builder deploys',
  async (_, { ethers }) => {
    const bip39 = require('bip39')
    const hdkey = require('ethereumjs-wallet/hdkey')
    const mnemonic = bip39.generateMnemonic()
    LOG_DEBUG(`mnemonic: ${mnemonic}`)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    LOG_DEBUG(`seed: ${seed}`)
    const hdwallet = hdkey.fromMasterSeed(seed)
    const walletHdPath = "m/44'/60'/0'/0/"
    const accountIndex = 0
    const fullPath = walletHdPath + accountIndex
    LOG_DEBUG(`fullPath: ${fullPath}`)
    const wallet = hdwallet.derivePath(fullPath).getWallet()
    const privateKey = `0x${wallet._privKey.toString('hex')}`
    LOG_DEBUG(`privateKey: ${privateKey}`)
    const EthUtil = require('ethereumjs-util')
    const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString(
      'hex',
    )}`
    console.log(
      `🔐 Account Generated as ${address} and set as mnemonic in packages/hardhat`,
    )
    console.log(
      '💬 Use `yarn account` to get more information about the deployment account.',
    )

    fs.writeFileSync(`./generated/${address}.secret`, mnemonic.toString())
    fs.writeFileSync(mnemonicPath, mnemonic.toString())
  },
)

task(
  'account',
  'Get balance informations for the deployment account.',
  async (_, { ethers }) => {
    const hdkey = require('ethereumjs-wallet/hdkey')
    const bip39 = require('bip39')
    const mnemonic = fs.readFileSync(mnemonicPath).toString().trim()
    LOG_DEBUG(`mnemonic: ${mnemonic}`)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    LOG_DEBUG(`seed: ${seed}`)
    const hdwallet = hdkey.fromMasterSeed(seed)
    const walletHdPath = "m/44'/60'/0'/0/"
    const accountIndex = 0
    const fullPath = walletHdPath + accountIndex
    LOG_DEBUG(`fullPath: ${fullPath}`)
    const wallet = hdwallet.derivePath(fullPath).getWallet()
    const privateKey = `0x${wallet._privKey.toString('hex')}`
    LOG_DEBUG(`privateKey: ${privateKey}`)
    const EthUtil = require('ethereumjs-util')
    const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString(
      'hex',
    )}`

    qrcode.generate(address)
    console.log(`‍📬 Deployer Account is ${address}`)
    for (const n in config.networks) {
      // console.log(config.networks[n],n)
      try {
        const { url } = config.networks[n] as HttpNetworkUserConfig
        const provider = new ethers.providers.JsonRpcProvider(url)
        const balance = await provider.getBalance(address)
        console.log(` -- ${n} --  -- -- 📡 `)
        console.log(`   balance: ${ethers.utils.formatEther(balance)}`)
        console.log(`   nonce: ${await provider.getTransactionCount(address)}`)
      } catch (e) {
        if (DEBUG) console.log(e)
      }
    }
  },
)
