
```ts
import http from 'htpp';
setInterval(() => {
  http.get('http://localhost:3333/health', res => {
    const { statusCode } = res;
    let error;
    if (statusCode! >= 300) {
      error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
    }
    if (error) {
      console.error(error.message);
      return res.resume(); // Consume response data to free up memory
    }
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => console.log(rawData));
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}, 5000);
```

```http
POST http://localhost:3333/example/teste?query=string&array[]=1&array[]=2
Content-Type: application/json

{
  "request": "body"
}
```

```ts
ROUTER.post('/example/:routeParam', (request, response) => {
  response.json({
    requestBody: request.body,
    queryParams: request.query,
    routeParams: request.params,
    requestHeaders: request.headers,
  });
})
```


`settings.json`
```json
{
  "material-icon-theme.folders.associations": {
    "infra": "app",
    "entities": "class",
    "schemas": "class",
    "typeorm": "database",
    "repositories": "mappings",
    "http": "container",
    "migrations": "tools",
    "modules": "components",
    "fakes": "mock",
    "websockets": "pipe",
    "protos": "pipe",
    "grpc": "pipe"
  }
}
```

<!-- RestController Methods: index, store, show, update, destroy -->
<!-- FullMVCCOntroller Methods: create, edit -->



*Resumo do q vi na aula2:*
- Aplicação de reciclagem e coleta de lixo
- Typescript no backend
- ts-node e ts-node-dev no lugar de node e nodemon (não teve config de webpack)
- Banco sql com knex e migrations
- Seeds para alimentar base
- Trasaction no banco
- Relacionamento n-n em uma tabela pivot
- Extensão para sqlite no vscode


https://youtu.be/XEswWb5Ail8
aplicação node com express usando typescrip e banco sql


*TODO:*
  - Verificar se endpoints do trabalho com query raw no banco podem ter sql injection
 - Aplicar Service Pattern
 - Aplicar Repository Pattern (Data Mapper)
 - Configurar Rota estática para aplciação front
 - Configurar pipeline netlify, circleci, amazon ec2, terraform, RDS
