# OZmap Geolocation API

Uma API RESTful robusta e internacionalizada para gerenciamento de geolocalizações (regiões) com operações CRUD e consultas geoespaciais. Construída com Node.js, Express, TypeScript e MongoDB.

## 🚀 Funcionalidades

- **CRUD de Regiões**: Crie, leia, atualize e exclua regiões definidas como polígonos GeoJSON.
- **Consultas Geoespaciais**:
  - Encontrar regiões que contêm um ponto específico (longitude/latitude).
  - Encontrar regiões dentro de uma distância de um ponto.
  - Encontrar regiões por endereço (usando geocodificação).
- **Internacionalização (i18n)**: Todas as mensagens de erro e logs são traduzidas (PT/EN) e respeitam o header `Accept-Language` ou o parâmetro de query `?lang`.
- **Testes completos**: Testes unitários e de integração com Mocha/Chai. Relatório de cobertura disponível.
- **Documentação Swagger/OpenAPI**: Documentação interativa em `/api-docs`.
- **Dockerizado**: Desenvolvimento e testes locais facilitados com Docker Compose.

## 🏗️ Estrutura do Projeto

- `src/` — Código-fonte principal
  - `modules/region/` — Domínio de regiões (controllers, services, models, testes)
  - `common/` — Decorators, erros, interfaces e serviços compartilhados
  - `middlewares/` — Middlewares do Express
  - `config/` — Configuração da aplicação, banco, logging e Swagger
  - `I18n/` — Arquivos de tradução
- `test/` — (se presente) Arquivos de teste adicionais

## ⚡ Início Rápido

### 1. Clone e Instale

```sh
git clone <repo-url>
cd technical-assessment-ozmap
npm install
```

### 2. Variáveis de Ambiente

Copie `.env.test` como `.env` e ajuste conforme necessário:

```
MONGODB_URI=mongodb://localhost:27017/ozmap
GOOGLE_MAPS_API_KEY=<sua-chave-google-geocoding>
```

### 3. Inicie o banco de dados via Docker

```sh
docker-compose up --build
```

- O MongoDB roda em um container (veja `docker-compose.yml`)

### 4. Inicie o servidor localmente (sem Docker)

- Execute:

```sh
npm run build
npm run dev
```

### 5. Rode os Testes e Cobertura

```sh
npm test
npm run coverage
```

- Relatório de cobertura: `coverage/lcov-report/index.html` (abra no navegador)
- Todos os endpoints possuem testes unitários e de integração. Os nomes dos testes seguem o padrão: `MÉTODO - endpoint - número - descrição` para integração e `- Test N - descrição` para unitários.
- Para interpretar o relatório de coverage, arquivos "fantasmas" podem aparecer se removidos recentemente; rode `npm run coverage` após limpar a build.

## 📦 Exemplos de Payload da API

### Payload Válido de Região

```json
{
  "name": "São Paulo",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-46.693419, -23.568704],
        [-46.641146, -23.568704],
        [-46.641146, -23.525024],
        [-46.693419, -23.525024],
        [-46.693419, -23.568704]
      ]
    ]
  }
}
```

### Payload Inválido de Região (polígono não fechado)

```json
{
  "name": "Inválido",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [0, 0],
        [1, 0],
        [1, 1]
      ]
    ]
  }
}
```

- O payload inválido acima resultará em erro 400 com mensagem de validação internacionalizada.
- Consulte `/api-docs` para exemplos interativos e schemas completos.

### Buscar endereços pelo Google (não retorna regiões do banco)

```bash
curl "http://localhost:3000/api/regions/query/address?address=Paulista"
```

**Resposta:**

```json
[
  {
    "latitude": -23.561684,
    "longitude": -46.655981,
    "formattedAddress": "Avenida Paulista, São Paulo - SP, Brasil"
  }
]
```

### Buscar regiões por ponto

```bash
curl "http://localhost:3000/api/regions/query/point?longitude=-46.65&latitude=-23.55"
```

**Resposta:**

```json
[
  {
    "id": "1",
    "name": "São Paulo",
    "geometry": { ... }
  }
]
```

### Buscar regiões por distância

```bash
curl "http://localhost:3000/api/regions/query/distance?longitude=-46.65&latitude=-23.55&distance=10000"
```

**Resposta:**

```json
[
  {
    "id": "1",
    "name": "São Paulo",
    "geometry": { ... }
  }
]
```

## 📚 Documentação da API

- Swagger UI interativo: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Todos os endpoints, schemas de request/response e mensagens de erro estão documentados.
- Exemplos de respostas de erro internacionalizadas:
  - `{"message": "Região não encontrada"}` (pt)
  - `{"message": "Region not found"}` (en)

## 🌍 Internacionalização

- Idioma padrão: Português (`pt`)
- Altere para inglês usando o header `Accept-Language: en` ou `?lang=en` na query.
- Todas as mensagens de erro e validação são traduzidas automaticamente.

## 🧑‍💻 Exemplos de Uso

### Criar uma Região

```bash
curl -X POST http://localhost:3000/api/regions/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "São Paulo",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-46.693419, -23.568704],
          [-46.641146, -23.568704],
          [-46.641146, -23.525024],
          [-46.693419, -23.525024],
          [-46.693419, -23.568704]
        ]
      ]
    }
  }'
```

### Listar Todas as Regiões

```bash
curl http://localhost:3000/api/regions/
```

### Buscar Regiões por Ponto

```bash
curl "http://localhost:3000/api/regions/query/point?longitude=-46.66&latitude=-23.55"
```

### Buscar Regiões por Endereço

```bash
curl "http://localhost:3000/api/regions/query/address?address=São+Paulo"
```

### Deletar uma Região

```bash
curl -X DELETE http://localhost:3000/api/regions/<regionId>
```

## 🛠️ Scripts

- `npm run build` — Compila o TypeScript
- `npm run dev` — Inicia o servidor em modo desenvolvimento com hot reload
- `npm test` — Executa todos os testes
- `npm run coverage` — Executa testes com relatório de cobertura
- `npm run lint` — Lint do código
- `npm run format:check` — Verifica formatação do código
- `npm run seed` — Popula o banco de dados com regiões de exemplo (executa o script `src/scripts/seed-regions.ts`)

## 📦 Como popular o banco de dados

Para inserir rapidamente regiões de exemplo no banco MongoDB, execute:

```sh
npm run seed
```

Esse comando executa o script `src/scripts/seed-regions.ts`, que insere várias regiões reais de São Paulo e outros bairros para facilitar os testes das APIs.

## 📝 Variáveis de Ambiente

- `MONGODB_URI` — String de conexão do MongoDB
- `GOOGLE_MAPS_API_KEY` — Chave da API Google Geocoding
- `DEFAULT_COUNTRY_CODE` — País padrão para geocodificação (padrão: `BR`)
- `PORT` — Porta da API (padrão: 3000)

## 🧪 Testes

- Todos os endpoints possuem testes unitários e de integração.
- Configuração do banco de testes em `.env.test`.
- Para rodar os testes, use Node.js 22+ (`nvm use 22`).
- O setup de testes garante isolamento e limpeza do banco entre execuções.

## 🧑‍💻 Autor & Licença

- Licença MIT — veja [LICENSE](./LICENSE)
- https://github.com/amilcarpio

---

# Desafio Técnico Original

Olá desenvolvedor(a)! Bem-vindo(a) ao Desafio Técnico do OZmap. Este é um projeto que simula um cenário real de nossa empresa, onde você irá desempenhar um papel crucial ao desenvolver uma API RESTful robusta para gerenciar localizações. Estamos muito animados para ver sua abordagem e solução!

## 🌍 **Visão Geral**

Em um mundo conectado e globalizado, a geolocalização se torna cada vez mais essencial. E aqui no OZmap, buscamos sempre otimizar e melhorar nossos sistemas. Assim, você encontrará um protótipo que precisa de sua experiência para ser corrigido, melhorado e levado ao próximo nível.

## 🛠 **Especificações Técnicas**

- **Node.js**: Versão 22 ou superior.
- **Framework**: Express.
- **Testes**: Mocha/Chai.
- **Banco de Dados**: Mongo 8+.
- **ORM**: Mongoose.
- **Linguagem**: Typescript.
- **Formatação e Linting**: Eslint + prettier.
- **Comunicação com MongoDB**: Deve ser feita via container.

## 🔍 **Funcionalidades Esperadas**

### Regiões

- Uma região é definida como um polígono em GeoJSON, um formato padrão para representar formas geográficas.
- Cada região tem:

  - **Nome**
  - **Coordenadas**: um conjunto de coordenadas que formam o polígono
- Lista de requisitos:

  - **CRUD** completo para regiões.
  - Listar regiões contendo um ponto específico, a partir de uma coordenada como dado de entrada
  - Listar regiões a uma determinada distância de um ponto
  - Passar um endereço (usar um serviço de geolocalização para resolver o endereço em coordenadas) e retornar as regiões que o contêm.
- Exemplo de um polígono simples em GeoJSON:

  ```json
  {
    "type": "Polygon",
    "coordinates": [
      [
        [longitude1, latitude1],
        [longitude2, latitude2],
        [longitude3, latitude3],
        [longitude1, latitude1] // Fecha o polígono
      ]
    ]
  }
  ```

### Testes

- Unitários e de integração.

## 🌟 **Diferenciais**

- Documentação completa da API.
- Internacionalização.
- Cobertura de código.
- Controle de busca de endereços por código de país, configurável por variável de ambiente

## ⚖ **Critérios de Avaliação**

1. Organização e clareza do código.
2. Estruturação do projeto.
3. Qualidade e eficiência do código.
4. Cobertura e qualidade de testes.
5. Pontos diferenciais citados acima.
6. Tempo de entrega (será considerado apenas o cumprimento do prazo, sem distinção entre entregas feitas no primeiro ou no último dia, com ênfase na qualidade da entrega).
7. Padronização e clareza das mensagens de erro.
8. Organização dos commits.
9. Implementação de logs.
10. Adesão às boas práticas de API RESTful.

## 🚀 **Entrega**

1. Crie um repositório público com a base desse código.
2. Crie uma branch para realizar o seu trabalho.
3. Ao finalizar, faça um pull request para a branch `main` do seu repositório.
4. A revisão do teste será feita **em cima do PR aberto** para a branch `main`!
5. Envie um email para `rh@ozmap.com.br` informando que o teste foi concluído.
6. Aguarde nosso feedback.

---

Estamos ansiosos para ver sua implementação e criatividade em ação! Boa sorte e que a força do código esteja com você! 🚀
