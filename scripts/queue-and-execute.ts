import {
  developmentChains,
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  MIN_DELAY,
} from '../helper-hardhat-config'
import { ethers, network } from 'hardhat'
import { moveBlocks } from '../utils/move-blocks'
import { moveTime } from '../utils/move-time'

const index = 0

async function queueAndExecute() {
  const args = [NEW_STORE_VALUE]
  const box = await ethers.getContract('Box')
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args)
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION),
  )

  const governor = await ethers.getContract('GovernorContract')
  console.log('Queuing...')
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash,
  )
  await queueTx.wait(1)

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1)
    await moveBlocks(1)
  }

  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash,
  )
  await executeTx.wait(1)

  const newBoxValue = await box.retrieve()
  console.log(`Box is updated to ${newBoxValue}`)
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
