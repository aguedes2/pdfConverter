import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'

import { main } from './pdfProcessor.js'
import { isPDFProtected } from './same.js'
import { extractTextFromPDF } from './pdfTesseract.js'

const app = express()
app.use(express())
app.use(express.static('files'))
app.use(cors())

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const filename = `${file.originalname}` //Mantem a extensão original
    cb(null, filename)
  }
})

//Middleware multer para processar upload do arquivo
const upload = multer({ storage }) //Especificando o diretório onde os arquivos serão armazenados.

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  try {
    const pdfEnviado = req.file
    if (pdfEnviado.mimetype !== 'application/pdf') {
      console.error('O arquivo não é um PDF válido.')
      return res
        .status(400)
        .json({ error: 'Arquivo invalido. Deve ser um PDF.' })
    }

    const dataBuffer = fs.readFileSync(pdfEnviado.path)
    const pdf = new Uint8Array(dataBuffer)
    console.debug(pdf)

    isPDFProtected(dataBuffer)
      .then((isProtected) => {
        if (isProtected) {
          extractTextFromPDF(pdf)
        } else {
          console.log('PDF não protegido. Realizando processo de extração...')

          let nomeArquivo = pdfEnviado.originalname
          status = nomeArquivo
          main(pdf, nomeArquivo).catch((error) =>
            console.error(`Ocorreu um erro: ${error}`)
          )
        }
      })
      .catch((error) => {
        console.error('Erro: ', error)
      })
    return res.json(`Arquivo Carregado: ${pdfEnviado.originalname}`)
  } catch (error) {
    console.error(`Erro no servidor: ${error}`)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333')
})
