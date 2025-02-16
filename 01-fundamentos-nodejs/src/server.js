import http from 'node:http'
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract_query_params.js';


const server = http.createServer(async (req, res) =>{
  const { method, url} = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if(route){
    const routeParams = req.url.match(route.path)

    const {query, ...params} = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    req.params = {...routeParams.groups}

    return route.handler(req,res)
  }

  res.writeHead('404').end()

})

server.listen(3334);









// CommonJS => Require, é a importação legado
//const http = require('http')

// ESModules => import/export, importação atual precisa ajusta o package, por padrão modulos padrão nas boas práticas começam com node:


// #HTTP request
// Método HTTP
// URL

// #Métodos de API - GET, POST, PATCH, DELETE
// GET => Busca um informação do back-end
// POST => Criar uma informação do back-end
// PUT => Atualizar um recurso no back-end
// PATCH => Atualizar um informação específica de um recurso de back-end
// Listagem usuários
// Criar usuário
// Edição de usuário
// Remoção de usuários

// Stateful vs Staless
// Stateful salvo em memória
// Stateless salva em dispositivos externos

// Cabeçalhos (Requisição/resposta) => Metadados

// JSON - JavaScript Object Notation

// HTTP Status Code
// - 1xx: Informational, códigos de informação
// - 2xx: Success, códigos de sucesso
// - 3xx: Redirection, código de redirecionamentos
// - 4xx: Cliente Erros, códigos de erros do cliente,
// - 5xx: Server errors, código que apontam erros de servidor