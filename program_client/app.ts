
import {Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction,} from "@solana/web3.js";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import {
    revokeIdCardSendAndConfirm,
    CslSplTokenPDAs,
    deriveNftmetadataPDA,
    getNftmetadata,
    initializeClient,
    issueIdCardSendAndConfirm,
    claimIdCardSendAndConfirm,
    revokeIdCard,
} from "./index";
import {getMinimumBalanceForRentExemptAccount, getMint, TOKEN_PROGRAM_ID,} from "@solana/spl-token";

async function main(feePayer: Keypair) {
    const args = process.argv.slice(2);
    const connection = new Connection("https://api.devnet.solana.com", {
        commitment: "confirmed",
    });

    const progId = new PublicKey(args[0]!);

    initializeClient(progId, connection);


    /**
     * Create a keypair for the mint
     */
    const mint = Keypair.generate();
    console.info("Issue NFT Id card");
    console.info(mint.publicKey.toBase58());

    /**
     * Create two wallets
     */
    const employee = Keypair.generate();
    console.info("+==== Employee Wallet ====+");
    console.info(employee.publicKey.toBase58());

    const Admin = Keypair.generate();
    console.info("Adminstrator (Issuer) Wallet");
    console.info(Admin.publicKey.toBase58());

    const rent = await getMinimumBalanceForRentExemptAccount(connection);
    await sendAndConfirmTransaction(
        connection,
        new Transaction()
            .add(
                SystemProgram.createAccount({
                    fromPubkey: feePayer.publicKey,
                    newAccountPubkey: employee.publicKey,
                    space: 0,
                    lamports: rent,
                    programId: SystemProgram.programId,
                }),
            )
            .add(
                SystemProgram.createAccount({
                    fromPubkey: feePayer.publicKey,
                    newAccountPubkey: Admin.publicKey,
                    space: 0,
                    lamports: rent,
                    programId: SystemProgram.programId,
                }),
            ),
        [feePayer, employee, Admin],
    );

    /**
     * NFT ID MetaData
     */
    const [IDpub] = deriveNftmetadataPDA(
        {
            mint: mint.publicKey,
        },
        progId,
    );
    console.info("+==== Id card Metadata Address ====+");
    console.info(IDpub.toBase58());

    /**
     * Derive the John Doe's Associated Token Account, this account will be
     * holding the minted NFT.
     */
    const [EmployeeATA] = CslSplTokenPDAs.deriveAccountPDA({
        wallet: employee.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
    });
    console.info("+==== Employee ATA ====+");
    console.info(EmployeeATA.toBase58());

    /**
     * Derive the Jane Doe's Associated Token Account, this account will be
     * holding the minted NFT when John Doe transfer it
     */
    const [AdminATA] = CslSplTokenPDAs.deriveAccountPDA({
        wallet: Admin.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
    });
    console.info("+==== Issuer ATA ====+");
    console.info(AdminATA.toBase58());

    /**
     * Mint a new NFT into John's wallet (technically, the Associated Token Account)
     */
    console.info("+==== Issue ID Card. ====+");
    await issueIdCardSendAndConfirm({
        wallet: employee.publicKey,
        assocTokenAccount: EmployeeATA,
        eId: 4294967295,
        empEmail: "nikhil@Organization.com",
        employeeName: "Nikhil Taneja",
        empAddress: "VPO Kahnaur, ROhtak, Haryana",
        signers: {
            feePayer: feePayer,
            funding: feePayer,
            mint: mint,
            owner: employee,
        },
    });
    console.info("+==== Minted ====+");

    /**
     * Get the minted token
     */
    let issueAccount = await getMint(connection, mint.publicKey);
    console.info("+==== Issued ====+");
    console.info(issueAccount);

    /**
     * Get the ID Metadata
     */
    let IDMetadata = await getNftmetadata(IDpub);
    console.info("+==== id Card Metadata ====+");
    console.info(IDMetadata);
    console.assert(IDMetadata!.assocAccount!.toBase58(), EmployeeATA.toBase58());

    /**
     * Employee Claiming the ID Card (technically, the Associated Token Account)
     */
    console.info("+==== Transferring... ====+");
    await claimIdCardSendAndConfirm({
        wallet: Admin.publicKey,
        assocTokenAccount: AdminATA,
        mint: mint.publicKey,
        source: EmployeeATA,
        destination: AdminATA,
        signers: {
            feePayer: feePayer,
            funding: feePayer,
            authority: employee,
        },
    });
    console.info("+==== Sent to Employee ====+");

    /**
     * Get the minted token
     */
    issueAccount = await getMint(connection, mint.publicKey);
    console.info("+==== Issued ====+");
    console.info(issueAccount);

    /**
     * Get the IDMetadata Metadata
     */
    IDMetadata = await getNftmetadata(IDpub);
    console.info("+==== ID Card Metadata ====+");
    console.info(IDMetadata);
    console.assert(IDMetadata!.assocAccount!.toBase58(), AdminATA.toBase58());

    /**
     * Burn the NFT
     */
    console.info("+==== Burning... ====+");
    await revokeIdCardSendAndConfirm({
        mint: mint.publicKey,
        wallet: Admin.publicKey,
        signers: {
            feePayer: feePayer,
            owner: Admin,
        },
    });
    console.info("+==== Burned ====+");

    /**
     * Get the minted token
     */
    issueAccount = await getMint(connection, mint.publicKey);
    console.info("+==== Mint ====+");
    console.info(issueAccount);

    /**
     * Get the IDMetadata Metadata
     */
    IDMetadata = await getNftmetadata(IDpub);
    console.info("+==== IDMetadata Metadata ====+");
    console.info(IDMetadata);
    console.assert(typeof IDMetadata!.assocAccount, "undefined");
}

fs.readFile(path.join(os.homedir(), ".config/solana/id.json")).then((file) =>
    main(Keypair.fromSecretKey(new Uint8Array(JSON.parse(file.toString())))),
);
