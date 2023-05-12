import express from "express"
import cors from "cors"


const app = express()

const PORT = 4000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
