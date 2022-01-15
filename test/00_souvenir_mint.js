const { expect } = require('chai');
const Souvenir = artifacts.require('src/contracts/Souvenir.sol')

// https://github.com/dappuniversity/nft/blob/master/test/Color.test.js
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Souvenir', (accounts) => {
    let souvenir;


    before(async () => {
        souvenir = await Souvenir.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = souvenir.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await souvenir.name()
            assert.equal(name, 'Souvenir')
        })
        it('has a symbol', async () => {
            const symbol = await souvenir.symbol()
            assert.equal(symbol, 'SVN')
        })
    })
    describe('minting', async () => {

        it('creates a new token', async () => {
            const tx = await souvenir.mint('testhash',0)
            const totalSupply = await souvenir.totalSupply()
            // SUCCESS
            assert.equal(totalSupply, 1)
            const event = tx.logs[0].args
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')
            assert.equal(await souvenir.tokenURI(event.tokenId.toNumber()), 'https://ipfs.io/ipfs/testhash', 'tokenURI is correct')
        })
    })
    describe('burning', async () => {

        it('burns a token', async () => {
            await souvenir.mint('testhash',0)
            const tx = await souvenir.burn(1)
            const totalSupply = await souvenir.totalSupply()
            // SUCCESS
            const event = tx.logs[0].args
            assert.equal(totalSupply, 0)

            // FAILURE
            assert.equal()
        })
    })

})
