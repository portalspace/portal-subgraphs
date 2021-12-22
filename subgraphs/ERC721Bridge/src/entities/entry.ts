import { BigInt, Address, ethereum } from '@graphprotocol/graph-ts'

import { Entry, Token } from '../../generated/schema'

export function getEntry(
  account: Address,
  txId: BigInt,
  tokenId: BigInt,
  nftId: BigInt,
  fromChain: BigInt,
  toChain: BigInt,
  block: ethereum.Block
): Entry {
  let token = Token.load(tokenId.toString())
  let id = tokenId.toString().concat(':').concat(nftId.toString())
  let entry = new Entry(id)

  // entry data
  entry.txId = txId,
  entry.tokenId = tokenId
  entry.nftId = nftId
  entry.fromChain = fromChain
  entry.toChain = toChain

  // meta data
  entry.account = account
  entry.block = block.number
  entry.timestamp = block.timestamp

  // entry type
  entry.deposited = false
  entry.claimed = false

  // token data
  if (token) {
    entry.contractAddress = token.contractAddress
    entry.mainChain = token.mainChain
    entry.isMuon = token.isMuon
    entry.isMain = token.isMain
    entry.name = token.name
    entry.symbol = token.symbol
  }

  entry.save()
  return entry as Entry
}
