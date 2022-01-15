const { expect } = require('chai');
const Souvenir = artifacts.require('src/contracts/Souvenir.sol')

const _ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// https://github.com/dievardump/EIP2981-implementation/blob/main/test/00_royalties_721.js
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Souvenir', (accounts) => {
    let souvenir;


    before(async () => {
        souvenir = await Souvenir.deployed()
    })

    describe('Royalties', async () => {
        it('has correct royalties set', async () => {
            await souvenir.mint('testhash',1000)
            const royaltyInfo = await souvenir.royaltyInfo(1, 10000);
            assert.equal(royaltyInfo[1].toNumber(),1000);
        })

        it('royalties set too high', async () => {
            // await souvenir.mint('testhash',20000).should.be.rejectedWith('ERC2981Royalties: Too high');
            // assert.equal(royaltyInfo[1].toNumber(),1000);
            const tx = await souvenir.mint('testhash',20000);
            assert.equal(tx.reason,'ERC2981Royalties: Too high', tx)
            // await expect(tx.reason).should.be.rejectedWith('ERC2981Royalties: Too high');
        })
        it('royaltyrecipient is set correctly', async () => {
            const tx = await souvenir.mint('testhash',1000);
            const recipient = await souvenir.royaltyRecipient();
            assert.equal(accounts[0], recipient, "correct")
            // await expect(tx.reason).should.be.rejectedWith('ERC2981Royalties: Too high');
        })
    })

})
