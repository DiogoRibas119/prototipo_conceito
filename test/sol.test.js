const { assert } = require('chai');

const Test = artifacts.require("hashTest");

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Test', (accounts) => {
    let test

    before(async() => {
        test = await Test.deployed()
    })

    describe('deployment', async () => {
        it('deploys sucessfully', async () => {
            const address = test.address
            assert.notEqual(address, '') 
            assert.notEqual(address, null) 
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)  
        }) 
    })
    describe('storage', async () => {
        it('updates the hashTest', async () => {
            let testHash = 'abc123'
            await test.set(testHash)
            const result = await test.get()
            assert.equal(result, testHash)
            console.log(result)
        })
    })
})