const { expect } = require('chai');
const Souvenir = artifacts.require('src/contracts/Souvenir.sol')

const TEST_ADDRESS = '0x66e762561A7F054461b0b5BBBeC2A2c38E1E7838';
const TEST_HASH = 'QmTDn4XmPLoZhLkXzURYLyKgn8SYuftuF8k4VT7QJZPLFK';

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
            await souvenir.mint(TEST_HASH,1,1000)
            const royaltyInfo = await souvenir.royaltyInfo(1, 10000);
            assert.equal(royaltyInfo[1].toNumber(),1000);
        })

        it('royalties set too high', async () => {
            try{
                await souvenir.mint(TEST_HASH,1,20000)
            }
            catch (e) {
                assert.equal(e.reason,'ERC2981Royalties: Too high', "royalties too high (>100%)")
            }
        })
        it('royaltyrecipient is set correctly', async () => {
            await souvenir.mint(TEST_HASH,1,1000);
            const recipient = await souvenir.royaltyRecipient();
            assert.equal(accounts[0], recipient, "royalty recipient set correctly")
        })
        it('setRoyaltyrecipient sets recipient correctly', async () => {
            await souvenir.setRoyaltyRecipient(TEST_ADDRESS);
            const recipient = await souvenir.royaltyRecipient();
            assert.equal(TEST_ADDRESS, recipient, "setter set royalty recipient correctly")
        })})

})
