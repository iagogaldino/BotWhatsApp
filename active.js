const axios = require('axios');

function fazerRequisicaoPeriodica() {
  setInterval(async () => {
    try {
      const response = await axios.get('https://luck-app.onrender.com/getConfigApp');
      console.log('Dados recebidos:', response.data);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  }, 10 * 60 * 1000); // 10 minutos em milissegundos
}

fazerRequisicaoPeriodica();