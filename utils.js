import { ethers } from 'ethers';
import { LitContracts } from '@lit-protocol/contracts-sdk';


export const getSigner = () => {
    const provider = new ethers.providers.JsonRpcProvider("https://chain-rpc.litprotocol.com/http");
    // use a private key key that has some Lit tokens in it for gas.  You can use any wallet here, it just needs gas.
    const privateKey = process.env.LIT_ROLLUP_MAINNET_DEPLOYER_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);
    return wallet;
};

export const getDataForPkps = async (pkps) => {
    console.log(`Getting data for ${pkps.length} PKPs`)

    const signer = getSigner();
    const contractClient = new LitContracts({ signer, network: 'cayenne' });
    await contractClient.connect();

    // list their permissions
    const pkpsWithData = {};
    for (let p of pkps) {
        // convert PKP Public Key to tokenId
        const tokenId = ethers.utils.keccak256("0x" + p);
        const authMethods = await contractClient.pkpPermissionsContract.read.getPermittedAuthMethods(tokenId);
        // console.log(authMethods);

        // for each auth method, also get the scopes for it
        const authMethodsWithScopes = []
        for (let a of authMethods) {
            const scopes = await contractClient.pkpPermissionsContract.read.getPermittedAuthMethodScopes(tokenId, a.authMethodType, a.id, 100);
            // console.log(scopes);
            authMethodsWithScopes.push({ ...a, scopes })
        }
        pkpsWithData[p] = authMethodsWithScopes;
    }
    // console.log('pkpsWithData', JSON.stringify(pkpsWithData, null, 2))
    return pkpsWithData;
}


export const mintPkpsWithAuthMethods = async (pkpsWithData, newNetwork) => {
    const signer = getSigner();
    const contractClient = new LitContracts({ signer, network: newNetwork });
    await contractClient.connect();

    const mintCost = await contractClient.pkpNftContract.read.mintCost();

    const newPkps = {};
    let counter = 1;
    for (let p of Object.keys(pkpsWithData)) {
        const authMethodsWithScopes = pkpsWithData[p];
        const authMethodTypes = authMethodsWithScopes.map(a => a.authMethodType);
        const authIds = authMethodsWithScopes.map(a => a.id);
        const userPubkeys = authMethodsWithScopes.map(a => a.userPubkey);
        const scopes = authMethodsWithScopes.map(a => a.scopes.map((e, idx) => e ? idx : null).filter(e => e !== null));
        const tx = await contractClient.pkpHelperContract.write.mintNextAndAddAuthMethods(2, authMethodTypes, authIds, userPubkeys, scopes, true, true, { value: mintCost });
        const receipt = await tx.wait();
        // find the new PKP public key
        const pkpMintedEvent = receipt.events.find(e => e.topics[0] === "0x3b2cc0657d0387a736293d66389f78e4c8025e413c7a1ee67b7707d4418c46b8");
        const newPkp = "0x" + pkpMintedEvent.data.slice(130, 260);
        console.log(`Minted ${counter} of ${Object.keys(pkpsWithData).length} with tx ${receipt.transactionHash}`);
        // console.log(`receipt: ${JSON.stringify(receipt, null, 2)}`);
        newPkps[p] = { newPkp, txHash: receipt.transactionHash };
        counter++;
    }
    return newPkps
}