import {
  AddToken as AddTokenEvent,
  Claim as ClaimEvent,
  Deposit as DepositEvent,
} from '../generated/ERC721Bridge/NFTBridge'

import { createToken, setDeposited, setClaimed } from './entities'

export function addToken(event: AddTokenEvent): void {
  createToken(
    event.params.addr,
    event.params.tokenId,
    event.params.mintable,
  )
}

export function deposit(event: DepositEvent): void {
  setDeposited(
    event.params.user,
    event.params.txId,
    event.params.tokenId,
    event.params.nftId,
    event.params.toChain,
    event.block,
  )
}

export function claim(event: ClaimEvent): void {
  setClaimed(
    event.params.user,
    event.params.txId,
    event.params.tokenId,
    event.params.nftId,
    event.params.fromChain,
    event.block,
  )
}
