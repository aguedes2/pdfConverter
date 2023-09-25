import server from './server.js'

const form = document.querySelector('#formulario')
const status = document.querySelector('#status')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = new FormData(form)

  try {
    const response = await server.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' //Definição do cabeçalho O muter processa somente formulários que sejam multipart
      }
    })
    // console.log('Resposta do servidor: ', response.data)
    console.log(response)
    mostrarDados(response.data)
  } catch (error) {
    console.error(`Erro ao enviar arquivo ${error}`)
  }
})

export function mostrarDados(text) {
  status.textContent = text
  status.style.color = '#A0FF00'
  status.style.userSelect = 'none'
}
