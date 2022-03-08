import { run } from 'hardhat'

export const verify = async (contractAddress: string, args: any[]) => {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (getErrorMessage(e).toLowerCase().includes('already verified')) {
      console.log('Contract already verified')
    } else {
      console.log(e)
    }
  }
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
