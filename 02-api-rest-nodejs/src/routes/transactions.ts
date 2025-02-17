import { FastifyInstance } from "fastify"
import { knex } from "../database" 
import {z} from 'zod'
import {randomUUID} from 'node:crypto'
import { checkSessionIdExists } from "../middleware/check-session-id-exists"

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request,reply) => {
  })

  // Index return all
  app.get(
    '/',
  {
    preHandler: [checkSessionIdExists]
  }, 
  async (request, reply) => {
    const {sessionId} = request.cookies
    
    const transactions = await knex('transactions')
    .where('session_id', sessionId)
    .select()
       
    return {
      transactions
    }
  })
  // End Index

  // Summary 
  app.get('/summary',
  {
    preHandler: [checkSessionIdExists]
  },  
  async (request) => {
    const {sessionId} = request.cookies
    const summary = await knex('transactions')
    .where('session_id', sessionId)  
    .sum('amount',  {as: 'amount'})
    .first()
    
    return {
      summary
    } 
  })
  // End Summary

  //Search 
  app.get('/:id',{
    preHandler: [checkSessionIdExists]
  },
  async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const {sessionId} = request.cookies
    const {id} = getTransactionParamsSchema.parse(request.params)
    
    const transaction = await knex('transactions').where(
      {
        session_id: sessionId,
        id
        
      }).first()
    
    return {
      transaction
    }
  })
  // End Search

  // Store
  app.post('/store', async (request, reply) => {
    const createStransctionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
      session_id: z.string().uuid().optional()
    })
    
    const {title,amount,type} = createStransctionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId
    if(!sessionId){
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId ,{
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 Days
      })
    } 

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.code(201).send()

  })
  // End Store
  
}