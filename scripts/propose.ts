import { ethers, network } from 'hardhat'
import {
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} from '../helper-hardhat-config'
import { moveBlocks } from '../utils/move-blocks'
import fs from 'fs'

export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string,
) {
  const governor = await ethers.getContract('GovernorContract')
  const box = await ethers.getContract('Box')

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args,
  )

  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
  console.log(`Proposal description: \n ${proposalDescription}`)
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription,
  )
  const proposeReceipt = await proposeTx.wait(1)

  // We force the local blockchain to move forward
  // If not, nothing will happen
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1)
  }

  const proposalId = proposeReceipt.events[0].args.proposalId
  const proposalState = await governor.state(proposalId)
  console.log(`Proposal state: ${proposalState}`)

  let proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'))
  proposals[network.config.chainId!.toString()].push(proposalId.toString())
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
