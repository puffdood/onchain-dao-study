import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { verify } from '../helper-functions'
import {
  developmentChains,
  MIN_DELAY,
  networkConfig,
} from '../helper-hardhat-config'

const deployTimeLock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log('Deploying TimeLock token...')
  const timelockToken = await deploy('TimeLock', {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`Deployed TimeLock token to: ${timelockToken.address}`)

  if (
    developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(timelockToken.address, [])
  }
}

export default deployTimeLock
deployTimeLock.tags = ['TimeLock']
