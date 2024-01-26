import { mintPkpsWithAuthMethods, getDataForPkps } from './utils.js'
import fs from 'fs';

const go = async () => {
    // start with your list of PKPs that you want to migrate.  This should come from your user list, which should be in a database somewhere. 
    const pkps = [
        "045805f3e9d9f52efdfc4d08166069c20642c7cdee262a77f32946d0aad7479ff34ddff9b444396c3011f02428939cc9e4080afd719eef850b8f1c792f65582bd6",
        "043ff68aaa08ac61ca23bb3ff4a2e03b5fe99ec87a6ea2139cc28dcf9aff7f5bca4be282f93676519ebc61806251da5dca09a9cb4252c8c4cf8d778dcae5882fb4",
        "04fda19f94f7683ca404057e227464b02694c35cf4528893d5bc72bff80b56b831b21a70c89068d6657762d505e4fcaa55408719639506efd5fa596cfb2e5f71fc"
    ]

    // get all the old PKP data including the auth methods and their scopes
    const pkpsWithData = await getDataForPkps(pkps);
    console.log(`We got data for ${Object.keys(pkpsWithData).length} PKPs`);

    // mint new PKPs with matching auth methods and scopes
    const newPkps = await mintPkpsWithAuthMethods(pkpsWithData, 'manzano');
    console.log(`We minted ${Object.keys(newPkps).length} new PKPs`);

    // save this list of new PKPs.  You must now migrate (or have your users migrate) their assets and authorizations to these new PKPs.
    fs.writeFileSync('newPkps.json', JSON.stringify(newPkps, null, 2));
}

go().then(() => { process.exit(0) }).catch((e) => { console.error(e); process.exit(1) });