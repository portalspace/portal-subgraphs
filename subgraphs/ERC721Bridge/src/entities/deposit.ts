import { BigInt, Address, ethereum } from '@graphprotocol/graph-ts'
import { CHAIN_ID } from 'const'

import { getEntry } from './entry'

export function setDeposited(
  account: Address,
  txId: BigInt,
  tokenId: BigInt,
  nftId: BigInt[],
  toChain: BigInt,
  block: ethereum.Block
): void {
  for (let i = 0; i < nftId.length; i++) {
    let id = tokenId.toString().concat(':').concat(nftId[i].toString())
    let entry = getEntry(
      account,
      txId,
      tokenId,
      nftId[i],
      BigInt.fromString(CHAIN_ID),
      toChain,
      block,
    )
    entry.deposited = true
    entry.claimed = false
    entry.save()
  }
}
