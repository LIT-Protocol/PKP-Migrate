# Migrating PKPs from Cayenne to Habanero

Since Habanero has new root keys, you will need to re-mint any PKPs on Habanero.  To do this, you can loop over all your old users and simply mint a new PKP on Habanero with the exact same auth methods.  At this point, your users could use both the old network PKP and the new network PKP with the same auth methods.  

However, the ETH address of each PKP will be different.  Your users may have things tied to the old PKP ETH address, like assets stored there, or AA wallets that see that PKP as authorized signer.  So the next step is to migrate these items.  

In the case of assets, like ETH or Tokens or NFTs, you must have the user send these to their new PKP wallet address.  Once they have sent their assets, the migration is complete.

In the case of AA wallets, you would change the authorized signer from the old PKP wallet address to the new PKP wallet address.  Once you’ve done this, the migration is complete.

# What this repo does

This repo provides an example of how to re-mint PKPs from Cayenne to Habanero.  The PKPs will have a new wallet address, but you can re-mint them with the same auth methods, so the new PKPs will be "ready to use" from the users perspective with respect to authentication.  You may still need to migrate any assets or authorizations manually to the new wallet.  For example, this might entail sending ETH from the old PKP Wallet to the new one, or any other assets the user may be holding in the old PKP such as NFTs.