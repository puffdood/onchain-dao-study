import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { verify } from '../helper-functions'
import { developmentChains, networkConfig } from '../helper-hardhat-config'

const deployGovernanceToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log('Deploying governance token...')
  const governanceToken = await deploy('GovernanceToken', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`Deployed governance token to: ${governanceToken.address}`)

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governanceToken.address, [])
  }

  await delegate(governanceToken.address, deployer)
  log('Delegated')
}

const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string,
) => {
  const governanceToken = await ethers.getContractAt(
    'GovernanceToken',
    governanceTokenAddress,
  )
  const tx = await governanceToken.delegate(delegatedAccount)
  await tx.wait(1)
  console.log(
    `Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`,
  )
}

export default deployGovernanceToken
deployGovernanceToken.tags = ['GovernanceToken']
