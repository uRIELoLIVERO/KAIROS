import express from 'express'

const app = express()
app.use(express.json())
app.disable('x-powered-by')
app.use()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kairos App!' })
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
