import fs from 'fs'
import pdfjslib from 'pdfjs-dist'

import { criarArquivo } from './utils.js'

export async function main(pdf, nome) {
  console.log('Tipo do nome', typeof nome)
  let texto = await completarArquivo(pdf)

  salvarArquivo(texto, nome)
  deletarPDF(pdf)
}

async function extrairText(pagina) {
  const textContent = await pagina.getTextContent()
  const textItems = textContent.items.map((item) => item.str).join(' ')

  return textItems
}

async function completarArquivo(file) {
  const pdfDocument = await pdfjslib.getDocument({ data: file }).promise

  const numPages = pdfDocument.numPages
  let allText = ''

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum)
    const pageText = await extrairText(page)
    allText += pageText + '\n'
  }
  console.debug(`Extração do texto completada com sucesso!`)
  return allText
}

function salvarArquivo(content, name) {
  let path = './files'
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, (err) => {
      if (err) throw `Erro ao criar diretório: ${err}`
      console.debug(`${path} criado com sucesso.`)
    })
  }

  criarArquivo(name, content)
}

function deletarPDF(nameFile) {
  fs.unlinkSync(`uploads/${nameFile}`)
}
