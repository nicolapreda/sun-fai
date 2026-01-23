const { setupCache } = require('axios-cache-interceptor');
const axios = require('axios');

const axiosInstance = setupCache(axios, {
  ttl: 60 * 1000 * 5,
  interpretHeader: false
});

async function getInstantPowers() {
    const data = (await axiosInstance.get("https://sun-fai.org/gestione_cer/file_server/dati_grafico_expo_energy.php?take=1")).data.misure;

    const sum = data.reduce((acc, item) => acc + item.potenza, 0);
    
    return {
        data,
        powerSum: sum
    };
}

module.exports = { getInstantPowers }