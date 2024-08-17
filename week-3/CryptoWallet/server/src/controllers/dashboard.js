const User = require("../models/user");
const { Wallet } = require('ethers');
const {generateMnemonic} = require('bip39');


const createAccount = async (req,res) => {
    const email = req.params.email;
    let mnemonic;

    try { 
        const user = await User.findOne({email});

        if(!user.walletSecret) {
            mnemonic = generateMnemonic();
            user.walletSecret = mnemonic;
        } else {
            mnemonic = user.walletSecret;
        }

        const wallet = Wallet.fromPhrase(mnemonic);

        user.accounts.push({
            privateKey : wallet.privateKey, 
            publicKey : wallet.address
        });
        user.save();

        res.status(200).send({privateKey : wallet.privateKey, publicKey : wallet.address, mnemonic});

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

const getAccounts = async (req,res) => {
    const email = req.params.email;
    
    try {
        const user = await User.findOne({email});
        res.status(200).send({accounts : user.accounts});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

module.exports = {createAccount, getAccounts};