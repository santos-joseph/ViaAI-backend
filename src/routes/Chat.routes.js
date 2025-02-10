import express, { json } from 'express'
import User from '../models/User.js'
import Chat from '../models/Chat.js'
import openai from '../config/openai.js'

const chatRouter = express.Router()

chatRouter.post('/', async (req, res) => {
  const { userId } = req.body
  const { title } = req.body

  if (!userId) return res.status(400).json({ error: 'ID do usuário é obrigatório.' })

  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' })

    const newChat = new Chat({ title, userId, messages: [] })
    await newChat.save()
    res.json({ chatId: newChat._id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao criar chat.' })
  }
})

chatRouter.get('/:userId', async (req, res) => {
  const { userId } = req.params

  if (!userId) {
      return res.status(400).json({ error: 'Id do usuário é obrigatório' })
  }

  try {
      const chats = await Chat.find({ userId })

      if (chats.length === 0) {
          return res.status(404).json({ message: 'Nenhum chat encontrado para este usuário.' })
      }

      return res.status(200).json(chats)
  } catch (error) {
      console.error('Erro ao buscar chats:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

chatRouter.post('/:chatId/messages', async (req, res) => {
    const { chatId } = req.params
    const { message } = req.body
  
    if (!message || !message.content) {
      return res.status(400).json({ error: 'Remetente e conteúdo são obrigatórios.' })
    }
  
    try {
      const chat = await Chat.findById(chatId)
      if (!chat) return res.status(404).json({ error: 'Chat não encontrado.' })
  
      const userMessage = { 
        sender: 'user', 
        content: message.content, 
        timestamp: new Date() 
      }
      
      chat.messages.push(userMessage)
      await chat.save()
  
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Você é Via, uma assistente jurídica especializada no Código de Trânsito Brasileiro. Responda de forma clara e objetiva, citando artigos do CTB sempre que possível. Caso não saiba a resposta, informe que precisa de mais detalhes. Você não deve responder perguntas sobre outros assuntos em hipótese alguma.',
            },
            ...chat.messages.map((m) => ({
              role: m.sender === 'Via' ? 'assistant' : 'user',
              content: m.content,
            })),
          ],
        })
      
        console.log('Resposta da OpenAI:', response)
      
        if (!response.choices || response.choices.length === 0) {
          return res.status(500).json({ error: 'A IA não retornou nenhuma resposta.' })
        }
      
        const aiMessageContent = response.choices[0].message.content
      
        const aiMessage = {
          sender: 'Via',
          content: aiMessageContent,
          timestamp: new Date(),
        }
      
        chat.messages.push(aiMessage)
        await chat.save()
      
        res.json({ userMessage, aiMessage })
      } catch (aiError) {
        console.error('Erro na resposta da IA:', aiError)
        res.status(500).json({ error: 'Erro ao gerar resposta da IA.' })
      }      
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Erro ao processar a mensagem.' })
    }
  })

chatRouter.delete('/:chatId', async (req, res) => {
    const { chatId } = req.params
  
    try {
      const chat = await Chat.findById(chatId)
      if (!chat) {
        return res.status(404).json({ error: 'Chat não encontrado.' })
      }
  
      await Chat.findByIdAndDelete(chatId)
      res.status(200).json({ message: 'Chat deletado com sucesso.' })
    } catch (error) {
      console.error('Erro ao deletar o chat:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
})
  

chatRouter.get('/:chatId/messages', async (req, res) => {
  const { chatId } = req.params
  try {
    const chat = await Chat.findById(chatId)
    if (!chat) return res.status(404).json({ error: 'Chat não encontrado.' })
    res.json(chat.messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar mensagens.' })
  }
})

export default chatRouter