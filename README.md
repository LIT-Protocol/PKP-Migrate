# Migrating PKPs from Cayenne to Habanero

Since Habanero has new root keys, you will need to re-mint any PKPs on Habanero.  To do this, you can loop over all your old users and simply mint a new PKP on Habanero with the exact same auth methods.  At this point, your users could use both the old network PKP and the new network PKP with the same auth methods.  

However, the ETH address of each PKP will be different.  Your users may have things tied to the old PKP ETH address, like assets stored there, or AA wallets that see that PKP as authorized signer.  So the next step is to migrate these items.  

In the case of assets, like ETH or Tokens or NFTs, you must have the user send these to their new PKP wallet address.  Once they have sent their assets, the migration is complete.

In the case of AA wallets, you would change the authorized signer from the old PKP wallet address to the new PKP wallet address.  Once you’ve done this, the migration is complete.

# What this repo does

This repo provides an example of how to re-mint PKPs from Cayenne to Habanero.  The PKPs will have a new wallet address, but you can re-mint them with the same auth methods, so the new PKPs will be "ready to use" from the users perspective with respect to authentication.  You may still need to migrate any assets or authorizations manually to the new wallet.  For example, this might entail sending ETH from the old PKP Wallet to the new one, or any other assets the user may be holding in the old PKP such as NFTs.

# How to use

Run `yarn` to install all the packages.

Open `migrate.js` and set the CONST variables at the top according to your use case.  

You can then use "yarn migrate" to run the migration.  The results will be saved in `newPkps.json`.  Each entry in the `newPkps.json` object is indexed by the old PKP public key and will look like the below:

```
{
    // the new PKP public key
    "newPkp": "0x041e1647868b1b34e1708a57f2c25483c40757f96f9bee5d5b7bd7488316b62dc4dd5ff206ab274bb7d33c87f658478cc017b3446577e2effc097c6022f671f03e",
    // the tx hash of this minting operation.  you can probably ignore this but it's included for debugging purposes.
    "txHash": "0x4294e434bde0742835afd69ad80480ee0ed32e5ff2d17f0eac1de2caa0ac770a",
    // the new PKP token ID.  The token ID is calculated with keccak256(pkpPublicKey).
    "newPkpTokenId": "0xcda1aa96c204a66e942f30f09f7778f7039e9475f294481a4628db2e1d8c248b",
    // the new PKP eth wallet address.  Your user should send their assets here.
    "newPkpEthAddress": "0x252920fe5396EB10Bdfe09b319d4552dfCd360a5",
    // the old PKP eth wallet address.  This will likely contain the assets your user should move.
    "oldPkpEthAddress": "0x76CdB495fE66D887aCeE54E724E547Ca835c8B19",
    // the old PKP token ID.  The token ID is calculated with keccak256(pkpPublicKey)
    "oldPkpTokenId": "0x1609bde01bc2c436d4c1c7c66dac0646a8f5a6654cbc0b329a4ffefb6b5ae350"
}
```