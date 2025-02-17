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

  it('should be able to get the summary', async () => {
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

  const transactionId = listTransactionsResponse.body.transactions[0].id

  const getTransactionResponse = await request(app.server)
    .get(`/transactions/${transactionId}`)
    .set('Cookie', cookies)
    .expect(200)
   
  expect(listTransactionsResponse.body.transactions).toEqual([
    expect.objectContaining({ 
      title: 'New Transaction',
      amount: 100,
    })

  ])
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
   .post('/transactions/store')
   .send({
     title: 'New Transaction',
     amount: 5000,
     type: 'credit',
   })

  const cookies = createTransactionResponse.headers['set-cookie']

  await request(app.server)
   .post('/transactions/store')
   .set('Cookie', cookies)
   .send({
     title: 'New Transaction',
     amount: 2000,
     type: 'debit',
   })
    
  const summaryResponse = await request(app.server)
    .get('/transactions/summary')
    .set('Cookie', cookies)
    .expect(200)
  
   
  expect(summaryResponse.body.summary).toEqual({
    amount: 3000,
  })
  })
 
})

