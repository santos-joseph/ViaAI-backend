import express from 'express'
import User from '../models/User.js'
import Chat from '../models/Chat.js'

const userRouter = express.Router()

userRouter.post('/', async (req, res) => {
    const { nome, email, senha } = req.body
  
    try {
      const userExists = await User.findOne({ email })
      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado.' })
      }
      if (!email){
        return res.status(400).json({ error: 'Email obrigatório.' })
      }
      if (!senha){
        return res.status(400).json({ error: 'Senha obrigatória.' })
      }
      const newUser = new User({ nome, email, senha })
      await newUser.save()
  
      res.status(201).json({ message: 'Usuário criado com sucesso!', userId: newUser._id })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Erro ao criar usuário.' })
    }
})

userRouter.post('/auth', async (req, res) => {
    const { email, senha } = req.body
  
    try {
      const user = await User.findOne({ email })
      if (!user || user.senha !== senha) {
        return res.status(401).json({ error: 'Credenciais inválidas.' })
      }
  
      res.json({ message: 'Autenticação bem-sucedida!', userId: user._id })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Erro ao autenticar usuário.' })
    }
})
  
userRouter.get('/', async (req, res) => {
    try {
      const users = await User.find({}, '-senha')
      res.json(users)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Erro ao buscar usuários.' })
    }
})
  
userRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
      const user = await User.findById(id, '-senha')
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' })
      res.json(user)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Erro ao buscar usuário.' })
    }
})
  
userRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { nome, email, senha } = req.body
  
    try {
      const user = await User.findById(id)
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' })
  
      if (nome) user.nome = nome
      if (email) user.email = email
      if (senha) user.senha = await bcrypt.hash(senha, 10)
  
      await user.save()
      res.json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Erro ao atualizar usuário.' })
    }
  })

userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
      const user = await User.findByIdAndDelete(id)
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' })
      res.json({ message: 'Usuário deletado com sucesso!' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Erro ao deletar usuário.' })
    }
})

userRouter.get('/:userId/chats', async (req, res) => {
    const { userId } = req.params
    try {
      const chats = await Chat.find({ userId })
      res.json(chats)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar chats do usuário.' })
    }
})


export default userRouter