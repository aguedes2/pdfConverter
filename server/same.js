import pdf from 'pdf-parse'
import fs from 'fs'

export async function isPDFProtected(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath)
    const data = await pdf(dataBuffer)
    return data.info['Encrypted'] === true
  } catch (error) {
    console.error('Erro ao verificar proteção do PDF: ', error)
    return false
  }
}
