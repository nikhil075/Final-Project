// This file is auto-generated from the CIDL source.
// Editing this file directly is not recommended as it may be overwritten.

import type {Schema} from 'borsh';
import type {Decoded} from "./utils";
import {PublicKey} from "@solana/web3.js";
import { deserialize } from "borsh";

/// A Solana NFT ID program for issuing, transferring, and burning NFT ID card in a organization.
export interface Nftmetadata {
  eId: number;
  companyName: string;
  departmentName: string;
  employeeName: string;
  empAddress: string;
  empEmail: string;
  empPhone: string;
  idImageUrl: string | undefined;
  mint: PublicKey;
  assocAccount: PublicKey | undefined;
}

export const decodeNftmetadata = (decoded: Decoded): Nftmetadata => ({
    eId: decoded["e_id"] as number,
    companyName: decoded["company_name"] as string,
    departmentName: decoded["department_name"] as string,
    employeeName: decoded["employee_name"] as string,
    empAddress: decoded["emp_address"] as string,
    empEmail: decoded["emp_email"] as string,
    empPhone: decoded["emp_phone"] as string,
    idImageUrl: decoded["id_image_url"] as string | undefined,
    mint: new PublicKey(decoded["mint"] as Uint8Array),
    assocAccount: decoded["assoc_account"] ? new PublicKey(decoded["assoc_account"]) : undefined,
});

export const NftmetadataSchema: Schema =  {
    struct: {
        e_id: "u32",
        company_name: "string",
        department_name: "string",
        employee_name: "string",
        emp_address: "string",
        emp_email: "string",
        emp_phone: "string",
        id_image_url: { option: "string" },
        mint: { array: { type: "u8", len: 32 } },
        assoc_account: { option: { array: { type: "u8", len: 32 } } },
    }
};

export module CslSplTokenTypes {
    /// Mint data.
    export interface Mint {
      mintAuthority: PublicKey;
      supply: bigint;
      decimals: number;
      isInitialized: boolean;
      freezeAuthority: PublicKey;
    }
    
    export const decodeMint = (decoded: Decoded): Mint => ({
        mintAuthority: new PublicKey(decoded["mint_authority"] as Uint8Array),
        supply: decoded["supply"] as bigint,
        decimals: decoded["decimals"] as number,
        isInitialized: decoded["is_initialized"] as boolean,
        freezeAuthority: new PublicKey(decoded["freeze_authority"] as Uint8Array),
    });
    
    export const MintSchema: Schema =  {
        struct: {
            mint_authority: { array: { type: "u8", len: 32 } },
            supply: "u64",
            decimals: "u8",
            is_initialized: "bool",
            freeze_authority: { array: { type: "u8", len: 32 } },
        }
    };
    
    /// Account data
    export interface Account {
      mint: PublicKey;
      owner: PublicKey;
      amount: bigint;
      delegate: PublicKey;
      state: number;
      isNative: bigint;
      delegatedAmount: bigint;
      closeAuthority: PublicKey;
    }
    
    export const decodeAccount = (decoded: Decoded): Account => ({
        mint: new PublicKey(decoded["mint"] as Uint8Array),
        owner: new PublicKey(decoded["owner"] as Uint8Array),
        amount: decoded["amount"] as bigint,
        delegate: new PublicKey(decoded["delegate"] as Uint8Array),
        state: decoded["state"] as number,
        isNative: decoded["is_native"] as bigint,
        delegatedAmount: decoded["delegated_amount"] as bigint,
        closeAuthority: new PublicKey(decoded["close_authority"] as Uint8Array),
    });
    
    export const AccountSchema: Schema =  {
        struct: {
            mint: { array: { type: "u8", len: 32 } },
            owner: { array: { type: "u8", len: 32 } },
            amount: "u64",
            delegate: { array: { type: "u8", len: 32 } },
            state: "u8",
            is_native: "u64",
            delegated_amount: "u64",
            close_authority: { array: { type: "u8", len: 32 } },
        }
    };
    
}



