import fs from 'fs'

/** Criar diretório */
function criarDiretorio() {
  const dir = './files'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, (err) => {
      if (err) throw `Não possível criar o diretório ${dir}: ${err}`

      console.log(`${dir} criado com sucesso!`)
      return
    })
  }
  console.log(`${dir} já existe.`)
}

/** Criar arquivo */
export function criarArquivo(file, content) {
  const dir = './files'

  //Verificar se arquivo já existe
  let path = `${dir}/${file}`
  path = path.replace('.pdf', '.txt')
  if (!fs.existsSync(`${dir}`)) {
    fs.writeFile(path, content, (err) => {
      if (err) throw console.error(`Não possível criar arquivo ${file}: ${err}`)

      console.debug(`${file} criado com sucesso.`)
      return
    })
  } else {
    //pegar a quantidade de arquivos
    let listFiles = fs.readdirSync(dir)
    if (!listFiles.includes(file)) {
      fs.writeFile(path, content, (err) => {
        if (err) console.error(`Erro aou criar arquivo ${file} ${err}`)
      })
    } else {
      console.log(listFiles.indexOf(file))
      let pathNew = path.replace('.pdf', '.txt')
      let newPath = pathNew.replace('.txt', '0' + listFiles.length + '.txt')
      fs.writeFile(newPath, content, (err) => {
        if (err) throw `Erro ao criar arquivo ${newPath}`
      })
    }
  }
}
