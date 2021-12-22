import { BigInt, Address } from '@graphprotocol/graph-ts'
import { CHAIN_ID, NULL_CALL_RESULT_VALUE } from 'const'

import { Token } from '../../generated/schema'
import { ERC721 } from '../../generated/ERC721Bridge/ERC721'
import { ERC721NameBytes } from '../../generated/ERC721Bridge/ERC721NameBytes'
import { ERC721SymbolBytes } from '../../generated/ERC721Bridge/ERC721SymbolBytes'

export function createToken(
  contractAddress: Address,
  tokenId: BigInt,
  mintable: boolean,
): void {
  let token = new Token(tokenId.toString())
  token.contractAddress = contractAddress
  token.mainChain = BigInt.fromString(CHAIN_ID) // when working with bridged claimables we need to know where the `contractAddress` exists
  token.tokenId = tokenId
  token.isMuon = mintable
  token.isMain = !mintable
  token.name = fetchTokenName(contractAddress)
  token.symbol = fetchTokenSymbol(contractAddress)
  token.save()
}

export function fetchTokenName(contractAddress: Address): string {
  let contract = ERC721.bind(contractAddress)
  let contractNameBytes = ERC721NameBytes.bind(contractAddress)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  let nameResult = contract.try_name()
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (nameResultBytes.value.toHex() != NULL_CALL_RESULT_VALUE) {
        nameValue = nameResultBytes.value.toString()
      }
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

export function fetchTokenSymbol(contractAddress: Address): string {
  let contract = ERC721.bind(contractAddress)
  let contractSymbolBytes = ERC721SymbolBytes.bind(contractAddress)

  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  let symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (symbolResultBytes.value.toHex() != NULL_CALL_RESULT_VALUE) {
        symbolValue = symbolResultBytes.value.toString()
      }
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}
