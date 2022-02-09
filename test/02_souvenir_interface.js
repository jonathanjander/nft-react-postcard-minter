const { expect } = require('chai');
const Souvenir = artifacts.require('src/contracts/Souvenir.sol')
const _INTERFACE_ID_ERC165 = '0x01ffc9a7';
const _INTERFACE_ID_ROYALTIES_EIP2981 = '0x2a55205a';
const _INTERFACE_ID_ERC721 = '0x80ac58cd';

//tests for implemented interfaces
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Souvenir', () => {
    let souvenir;

    before(async () => {
        souvenir = await Souvenir.deployed()
    })
    describe('Interfaces', async () => {
        // adapted from
        // https://github.com/dievardump/EIP2981-implementation/blob/main/test/00_royalties_721.js
        it('has all interfaces', async () => {
            expect(
                await souvenir.supportsInterface(
                    _INTERFACE_ID_ERC165,
                ),
                'Error at Interface 165',
            ).to.be.true;

            expect(
                await souvenir.supportsInterface(
                    _INTERFACE_ID_ROYALTIES_EIP2981,
                ),
                'Error at Interface 2981',
            ).to.be.true;

            expect(
                await souvenir.supportsInterface(
                    _INTERFACE_ID_ERC721,
                ),
                'Error at Interface 721',
            ).to.be.true;
        })
    })

})
