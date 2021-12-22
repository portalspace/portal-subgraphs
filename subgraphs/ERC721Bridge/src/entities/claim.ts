import { BigInt, Address, ethereum } from '@graphprotocol/graph-ts'
import { CHAIN_ID } from 'const'

import { getEntry } from './entry'

export function setClaimed(
  account: Address,
  txId: BigInt,
  tokenId: BigInt,
  nftId: BigInt[],
  fromChain: BigInt,
  block: ethereum.Block
): void {
  for (let i = 0; i < nftId.length; i++) {
    let id = tokenId.toString().concat(':').concat(nftId[i].toString())
    let entry = getEntry(
      account,
      txId,
      tokenId,
      nftId[i],
      fromChain,
      BigInt.fromString(CHAIN_ID),
      block,
    )
    entry.deposited = false
    entry.claimed = true
    entry.save()
  }
}
