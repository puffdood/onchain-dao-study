import { expect, assert } from 'chai'
import { ethers, deployments } from 'hardhat'
import {
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} from '../helper-hardhat-config'
import { moveBlocks } from '../utils/move-blocks'
import { moveTime } from '../utils/move-time'
import {
  GovernorContract,
  GovernanceToken,
  TimeLock,
  Box,
} from '../typechain-types'
import { BigNumberish } from 'ethers'

describe('Governor Flow', function () {
  let governor: GovernorContract
  let governanceToken: GovernanceToken
  let timelock: TimeLock
  let box: Box

  beforeEach(async () => {
    await deployments.fixture(['all'])
    governor = await ethers.getContract('GovernorContract')
    timelock = await ethers.getContract('TimeLock')
    governanceToken = await ethers.getContract('GovernanceToken')
    box = await ethers.getContract('Box')
  })

  it("Box's value can only be updated through governance process", async () => {
    await expect(box.store(55)).to.be.revertedWith(
      'Ownable: caller is not the owner',
    )
  })

  // it('Governance process should work: propose -> vote -> queue -> execute', async () => {
  //   const encodedFunctionCall = await box.interface.encodeFunctionData(FUNC, [
  //     NEW_STORE_VALUE,
  //   ])
  //   const voteWay = 1
  //   const voteReason = 'Come with me if you want to live'
  //   const PROPOSAL_ACTIVE_STATE = 1
  //   const PROPOSAL_SUCCEEDED_STATE = 4
  //   // Propose
  //   const proposeTx = await governor.propose(
  //     [box.address],
  //     [0],
  //     [encodedFunctionCall],
  //     PROPOSAL_DESCRIPTION,
  //   )
  //   const proposeReceipt = await proposeTx.wait(1)
  //   const proposalId: BigNumberish = proposeReceipt.events![0].args!.proposalId
  //   let proposalState = await governor.state(proposalId)
  //   assert(proposalState === 0)
  //   await moveBlocks(VOTING_DELAY + 1)
  //   proposalState = await governor.state(proposalId)
  //   assert(proposalState === PROPOSAL_ACTIVE_STATE)

  //   // Vote

  //   // Queue

  //   // Execute
  // })
})
