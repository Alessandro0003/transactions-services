import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () =>{
    beforeAll(async () => {

        await app.ready()
    })
    
    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })
    
    it('should be able to create a new transactions ', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transactions',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)

            
    })

    it('should be able to list all transaction',async  () => {
        const createTransactionsResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transactions',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionsResponse.get('Set-Cookie')
        
        const listTransactionsResonse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            
            .expect(200)
        expect(listTransactionsResonse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New Transactions',
                amount: 5000,
            }),
        ])
    })  

    it('should be able to get a specific transaction',async  () => {
        const createTransactionsResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transactions',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionsResponse.get('Set-Cookie')
        
        const listTransactionsResonse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            
            .expect(200)

        const  transactionsId = listTransactionsResonse.body.transactions[0].id

        const getTransactionsResponse = await request(app.server)
            .get(`/transactions/${transactionsId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getTransactionsResponse.body.transactions).toEqual(
            expect.objectContaining({
                title: 'New Transactions',
                amount: 5000,
            }),
        )
    })  
})