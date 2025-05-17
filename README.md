# OZmap Challenge: Construindo a Geolocalização do Futuro

Olá desenvolvedor(a)! Bem-vindo(a) ao Desafio Técnico do OZmap. Este é um projeto que simula um cenário real de nossa
empresa, onde você irá desempenhar um papel crucial ao desenvolver uma API RESTful robusta para gerenciar localizações.
Estamos muito animados para ver sua abordagem e solução!

## 🌍 **Visão Geral**

Em um mundo conectado e globalizado, a geolocalização se torna cada vez mais essencial. E aqui no OZmap, buscamos sempre
otimizar e melhorar nossos sistemas. Assim, você encontrará um protótipo que precisa de sua experiência para ser
corrigido, melhorado e levado ao próximo nível.

## 🛠 **Especificações Técnicas**

- **Node.js**: Versão 22 ou superior.
- **Framework**: Express.
- ***Testes**: Mocha/Chai.
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
    - Passar um endereço ( usar um serviço de geolocalização para resolver o endereço em coordenadas) e retornar as
      regiões que o contêm.

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
6. Tempo de entrega (será considerado apenas o cumprimento do prazo, sem distinção entre entregas feitas no primeiro ou
   no último dia, com ênfase na qualidade da entrega).
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

Estamos ansiosos para ver sua implementação e criatividade em ação! Boa sorte e que a força do código esteja com você!
🚀
