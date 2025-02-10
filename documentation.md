# ViaAI - Backend Documentation
## Visão Geral
O ViaAI é uma assistente jurídica especializada no Código de Trânsito Brasileiro (CTB), desenvolvida para fornecer respostas rápidas e precisas sobre questões de trânsito. O backend foi construído utilizando Node.js e integra a API da OpenAI GPT-4 para processar e interpretar dúvidas jurídicas.

## Tecnologias Utilizadas
- **Node.js + Express** – Estrutura robusta para criação da API.
- **MongoDB + Mongoose** – Banco de dados NoSQL para armazenar informações e históricos de consultas.
- **OpenAI API** – Integração com o modelo GPT-4 para processamento de linguagem natural.

## Instalação

```bash
# Clone o repositório
git clone https://github.com/santos-joseph/ViaAI-backend.git

# Entre no diretório
cd ViaAI-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Inicie o servidor
npm start
```

## Configuração do Ambiente

Variáveis de ambiente necessárias:
```
MONGODB_URI=
OPENAI_API_KEY=
PORT=
```

## Modelos de Dados

### User
```javascript
{
  nome: String,
  email: String,
  senha: String
}
```

### Chat
```javascript
{
  title: String,
  userId: ObjectId,
  messages: [Message]
}
```

### Message
```javascript
{
  sender: String,
  content: String,
  timestamp: Date
}
```

## API Endpoints

### Usuários

#### Criar Usuário
- **POST** `/v0/api/user`
- **Body:**
```json
{
  "nome": "string",
  "email": "string",
  "senha": "string"
}
```
- **Resposta (201):**
```json
{
  "message": "Usuário criado com sucesso!",
  "userId": "string"
}
```

#### Autenticar Usuário
- **POST** `/v0/api/user/auth`
- **Body:**
```json
{
  "email": "string",
  "senha": "string"
}
```
- **Resposta (200):**
```json
{
  "message": "Autenticação bem-sucedida!",
  "userId": "string"
}
```

#### Listar Usuários
- **GET** `/v0/api/user`
- **Resposta (200):** Array de usuários

#### Buscar Usuário
- **GET** `/v0/api/user/:id`
- **Resposta (200):** Dados do usuário

#### Atualizar Usuário
- **PUT** `/v0/api/user/:id`
- **Body:**
```json
{
  "nome": "string",
  "email": "string",
  "senha": "string"
}
```
- **Resposta (200):**
```json
{
  "message": "Usuário atualizado com sucesso!"
}
```

#### Deletar Usuário
- **DELETE** `/v0/api/user/:id`
- **Resposta (200):**
```json
{
  "message": "Usuário deletado com sucesso!"
}
```

### Chats

#### Criar Chat
- **POST** `/v0/api/chat`
- **Body:**
```json
{
  "userId": "string",
  "title": "string"
}
```
- **Resposta (200):**
```json
{
  "chatId": "string"
}
```

#### Listar Chats do Usuário
- **GET** `/v0/api/chat/:userId`
- **Resposta (200):** Array de chats

#### Enviar Mensagem
- **POST** `/v0/api/chat/:chatId/messages`
- **Body:**
```json
{
  "message": {
    "content": "string"
  }
}
```
- **Resposta (200):**
```json
{
  "userMessage": {
    "sender": "user",
    "content": "string",
    "timestamp": "date"
  },
  "aiMessage": {
    "sender": "Via",
    "content": "string",
    "timestamp": "date"
  }
}
```

#### Buscar Mensagens do Chat
- **GET** `/v0/api/chat/:chatId/messages`
- **Resposta (200):** Array de mensagens

#### Deletar Chat
- **DELETE** `/v0/api/chat/:chatId`
- **Resposta (200):**
```json
{
  "message": "Chat deletado com sucesso."
}
```
