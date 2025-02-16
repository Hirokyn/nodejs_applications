import {expect, it, test, beforeAll, afterAll, describe} from 'vitest'
import request from 'supertest'
import {app} from '../app'
import { beforeEach } from 'node:test'
import { execSync } from 'node:child_process'
describe("Transactions", () => {
  beforeAll(async () => {
    await app.ready()
  
  })
  
  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {  
    execSync('npm run knex migrate:rollback')
    execSync('npm run knex migrate:latest')
  })

  test('The user could create a new transction', async () => {
    await request(app.server)
   .post('/transactions/store')
   .send({
     title: 'New Transaction',
     amount: 100,
     type: 'credit',
   })
   .expect(201)
  })

   it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
   .post('/transactions/store')
   .send({
     title: 'New Transaction',
     amount: 100,
     type: 'credit',
   })

  const cookies = createTransactionResponse.headers['set-cookie']
    
  const listTransactionsResponse = await request(app.server)
    .get('/transactions')
    .set('Cookie', cookies)
    .expect(200)
   
  expect(listTransactionsResponse.body.transactions).toEqual([
    expect.objectContaining({ 
      title: 'New Transaction',
      amount: 100,
    })

  ])
})
 
 })

