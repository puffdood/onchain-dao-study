import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { verify } from '../helper-functions'
import {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  developmentChains,
  networkConfig,
} from '../helper-hardhat-config'

const deployGovernorContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  log('Deploying GovernorContract token...')
  const governanceToken = await get('GovernanceToken')
  const timelockToken = await get('TimeLock')
  const governorContractToken = await deploy('GovernorContract', {
    from: deployer,
    args: [
      governanceToken.address,
      timelockToken.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`Deployed GovernorContract token to: ${governorContractToken.address}`)

  if (
    developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governorContractToken.address, [])
  }
}

export default deployGovernorContract
deployGovernorContract.tags = ['GovernorContract']
