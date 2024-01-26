import { mintPkpsWithAuthMethods, getDataForPkps } from './utils.js'
import fs from 'fs';

// You may change this depending on your use case.  This will add the PKP's eth address as a permitted address for that PKP.  You may or may not want to do this.  I would refer to your original implementation of how you currently mint PKPs for your user and if this is turned on or not.
const ADD_PKP_ETH_ADDRESS_AS_PERMITTED_ADDRESS = true;

// You may change this depending on your use case.  This will send the new PKP to itself.  You may or may not want to do this.  I would refer to your original implementation of how you currently mint PKPs for your user and if this is turned on or not.  If you do not turn this on, then the new PKP will be sent to the deployer address.
const SEND_PKP_TO_ITSELF = true;

// use a private key key that has some Lit tokens in it for gas.  You can use any wallet here, it just needs to have tokens on Chronicle.
const WALLET_PRIVATE_KEY = process.env.LIT_ROLLUP_MAINNET_DEPLOYER_PRIVATE_KEY;

// set this to the new network you want to mint the PKPs on.  You can choose either "manzano" or "habanero".
const NEW_NETWORK = "manzano";

const go = async () => {
    // start with your list of PKPs that you want to migrate.  This should come from your user list, which should be in a database somewhere. 
    const pkps = [
        "045805f3e9d9f52efdfc4d08166069c20642c7cdee262a77f32946d0aad7479ff34ddff9b444396c3011f02428939cc9e4080afd719eef850b8f1c792f65582bd6",
        "043ff68aaa08ac61ca23bb3ff4a2e03b5fe99ec87a6ea2139cc28dcf9aff7f5bca4be282f93676519ebc61806251da5dca09a9cb4252c8c4cf8d778dcae5882fb4",
        "04fda19f94f7683ca404057e227464b02694c35cf4528893d5bc72bff80b56b831b21a70c89068d6657762d505e4fcaa55408719639506efd5fa596cfb2e5f71fc"
    ]

    // get all the old PKP data including the auth methods and their scopes
    const pkpsWithData = await getDataForPkps(pkps, WALLET_PRIVATE_KEY);
    console.log(`We got data for ${Object.keys(pkpsWithData).length} PKPs`);

    // mint new PKPs with matching auth methods and scopes
    const newPkps = await mintPkpsWithAuthMethods(pkpsWithData, NEW_NETWORK, WALLET_PRIVATE_KEY, ADD_PKP_ETH_ADDRESS_AS_PERMITTED_ADDRESS, SEND_PKP_TO_ITSELF);
    console.log(`We minted ${Object.keys(newPkps).length} new PKPs`);

    // save this list of new PKPs.  You must now migrate (or have your users migrate) their assets and authorizations to these new PKPs.
    fs.writeFileSync('newPkps.json', JSON.stringify(newPkps, null, 2));
}

go().then(() => { process.exit(0) }).catch((e) => { console.error(e); process.exit(1) });