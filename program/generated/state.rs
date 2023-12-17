// This file is auto-generated from the CIDL source.
// Editing this file directly is not recommended as it may be overwritten.

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::account_info::AccountInfo;
use solana_program::pubkey::Pubkey;

#[derive(Clone, Debug)]
pub struct Account<'a, 'b, T> {
    pub data: T,
    pub info: &'a AccountInfo<'b>,
}

#[derive(Clone, Debug)]
pub struct AccountPDA<'a, 'b, T> {
    pub data: T,
    pub info: &'a AccountInfo<'b>,
    pub bump: u8,
}

impl<'a, 'b, T> Account<'a, 'b, T> {
    pub fn new(info: &'a AccountInfo<'b>, data: T) -> Self {
        Self { data, info }
    }
}

impl<'a, 'b, T> AccountPDA<'a, 'b, T> {
    pub fn new(info: &'a AccountInfo<'b>, data: T, bump: u8) -> Self {
        Self { data, info, bump }
    }
}

/// A Solana NFT ID program for issuing, transferring, and burning NFT ID card in a organization.
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Default)]
pub struct Nftmetadata {
	pub e_id: u32,
	pub company_name: String,
	pub department_name: String,
	pub employee_name: String,
	pub emp_address: String,
	pub emp_email: String,
	pub emp_phone: String,
	pub id_image_url: Option<String>,
	pub mint: Pubkey,
	pub assoc_account: Option<Pubkey>,
}

impl Nftmetadata {
	pub const LEN: usize = 529; 
	}

