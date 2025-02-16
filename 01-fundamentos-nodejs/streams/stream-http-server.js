import http from 'node:http'
import {Transform} from 'node:stream'

const server = http.createServer(async (req ,res) => { 
  const buffers = []
  for await (const chunk of req){
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers).toString()
  console.log(fullStreamContent)

  return res.end(fullStreamContent)

  // return req
  //   .pipe(new InverseNumberStream)
  //   .pipe(res)
  
})

class InverseNumberStream extends Transform {
  _transform(chunk, encode, callback){
    const transformed = Number(chunk.toString()) * -1

    console.log(transformed)

    callback(null, Buffer.from(String(transformed)))
  }

}

server.listen(3335);