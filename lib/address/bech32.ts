import ecc from '@bitcoinerlab/secp256k1';
import { keccak256 } from '@ethersproject/keccak256';
import { bech32 } from '@scure/base';
import * as bitcoin from 'bitcoinjs-lib';

import config from 'configs/app';
import bytesToHex from 'lib/bytesToHex';
import hexToBytes from 'lib/hexToBytes';

bitcoin.initEccLib(ecc);

export const DATA_PART_REGEXP = /^[\da-z]{38}$/;
export const BECH_32_SEPARATOR = '1'; // https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki#bech32

export function toBech32Address(hash: string) {
  if (config.UI.views.address.hashFormat.bech32Prefix) {
    try {
      const words = bech32.toWords(hexToBytes(hash));
      return bech32.encode(config.UI.views.address.hashFormat.bech32Prefix, words);
    } catch (error) {}
  }

  return hash;
}

export function isBech32Address(hash: string) {
  if (!config.UI.views.address.hashFormat.bech32Prefix) {
    return false;
  }

  if (!hash.startsWith(`${ config.UI.views.address.hashFormat.bech32Prefix }${ BECH_32_SEPARATOR }`)) {
    return false;
  }

  const strippedHash = hash.replace(`${ config.UI.views.address.hashFormat.bech32Prefix }${ BECH_32_SEPARATOR }`, '');
  return DATA_PART_REGEXP.test(strippedHash);
}

export function fromBech32Address(hash: string) {
  if (config.UI.views.address.hashFormat.bech32Prefix) {
    try {
      const { words, prefix } = bech32.decode(hash as `${ string }${ typeof BECH_32_SEPARATOR }${ string }`);

      if (prefix !== config.UI.views.address.hashFormat.bech32Prefix) {
        return hash;
      }

      const bytes = bech32.fromWords(words);
      return bytesToHex(bytes);
    } catch (error) {}
  }

  return hash;
}

export function isBTCAddress(hash: string) {
  let pkscript = null;
  try {
    pkscript = bitcoin.address.toOutputScript(hash, bitcoin.networks.bitcoin).toString('hex');
  } catch (error) {
    try {
      pkscript = bitcoin.address.toOutputScript(hash, bitcoin.networks.testnet).toString('hex');
    } catch (error) {
      return false;
    }
  }

  try {
    const pkscriptBuf = Buffer.from(pkscript, 'hex');
    const pkscriptHash = keccak256(pkscriptBuf);
    pkscriptHash.slice(-40);
    return true;
  } catch (error) {
    return false;
  }
}
export function fromBTCAddress(hash: string) {
  let pkscript = null;
  try {
    pkscript = bitcoin.address.toOutputScript(hash, bitcoin.networks.bitcoin).toString('hex');
  } catch (error) {
    try {
      pkscript = bitcoin.address.toOutputScript(hash, bitcoin.networks.testnet).toString('hex');
    } catch (error) {
      return hash;
    }
  }

  try {
    const pkscriptBuf = Buffer.from(pkscript, 'hex');
    const pkscriptHash = keccak256(pkscriptBuf);
    const addr = pkscriptHash.slice(-40);
    return '0x' + addr;
  } catch (error) {
    return hash;
  }
}

export function isInscriptionId(inscriptionId: string) {
  try {
    const inscriptionIdRegex = /^[0-9a-fA-F]{64}i\d+$/;
    if (!inscriptionIdRegex.test(inscriptionId)) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
