import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers } from 'hardhat'
import { developmentChains, networkConfig } from '../helper-hardhat-config'
import { verify } from '../helper-functions'

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log('Deploying Box token...')
  const boxToken = await deploy('Box', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`Deployed Box token to: ${boxToken.address}`)

  const timelock = await ethers.getContract('TimeLock')
  const boxContract = await ethers.getContractAt('Box', boxToken.address)
  const transferOwnerTx = await boxContract.transferOwnership(timelock.address)
  await transferOwnerTx.wait(1)
  log('Deployment completed')

  if (
    developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(boxToken.address, [])
  }
}

export default deployBox
deployBox.tags = ['Box']
