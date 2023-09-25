import { createWorker } from 'tesseract.js'
import fs from 'fs'
import pdfparse from 'pdf-parse'

async function inicializarWorker() {
  const worker = createWorker()
  await worker
    .load()(await worker)
    .loadLanguage('por')
    .initialize('por')
}

export async function extractTextFromPDF(pdfPath) {
  try {
    // Lê o arquivo PDF
    const pdfData = fs.readFileSync(pdfPath)
    const pdfText = await pdf(pdfData)

    // Inicializa o worker do tesseract.js
    inicializarWorker()

    // Extrai o texto de cada página e salva no arquivo de texto
    const totalPages = pdfText.numPages
    let fullText = ''

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf(pdfData, { pagerender: pageNum })
      const text = page.getText()
      fullText += text + '\n'

      // Realiza o OCR em cada página (opcional)
      const {
        data: { text: ocrText }
      } = await worker.recognize(text)
      fullText += ocrText + '\n'
    }

    // Finaliza o worker do tesseract.js
    await worker.terminate()

    // Salva o texto extraído em um arquivo de texto
    // Criando diretório

    //Criando arquivo
    //verificar se arquivo já existe
    const filesList = fs.readdirSync(dir)
    console.log(filesList)
    let outputPath = './files/file.txt'
    fs.writeFileSync(outputPath, fullText)

    console.log(`Texto extraído e salvo em ${outputPath}`)
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error)
  }
}
