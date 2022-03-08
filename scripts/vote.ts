import fs from 'fs'
import {
  developmentChains,
  proposalsFile,
  VOTING_PERIOD,
} from '../helper-hardhat-config'
import { ethers, network } from 'hardhat'
import { moveBlocks } from '../utils/move-blocks'

const index = 0

async function main(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'))
  const proposalId = proposals[network.config.chainId!][proposalIndex]
  // 0 = against, 1 = for, 2 = abstain
  const voteWay = 1
  const reason = 'I like a do da cha cha'
  await vote(proposalId, voteWay, reason)
}

async function vote(proposalId: string, voteWay: number, reason: string) {
  console.log('Voting...')

  const governor = await ethers.getContract('GovernorContract')
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason,
  )
  const voteTxReceipt = await voteTxResponse.wait(1)
  console.log(voteTxReceipt.events[0].args.reason)

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1)
  }

  const proposalState = await governor.state(proposalId)
  console.log(`Proposal state: ${proposalState}`)
  // 3: DEFEATED, 4: SUCCEEDED
  if (proposalState === 4) {
    console.log('VOTED! Ready to go!')
  } else {
    console.log('Voting failed')
  }
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
