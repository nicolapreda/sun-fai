const mysql = require('mysql2/promise');
const axios = require('axios');
const { setupCache } = require('axios-cache-interceptor');

// Cache setup for external SolarEdge calls
const axiosInstance = setupCache(axios, {
  ttl: 60 * 1000 * 5, // 5 minutes cache
  interpretHeader: false
});

const SOLAR_EDGE_API_BASEURL = 'https://monitoringapi.solaredge.com';

// Database config from connect.php
const dbConfig = {
    host: '127.0.0.1',
    user: 'u191507796_info_account',
    password: 'Sunfai2024',
    database: 'u191507796_sunfai',
    port: 3306
};

// Helper: Round date to nearest 15 minutes
function roundTo15Minutes(date) {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.floor(minutes / 15) * 15;
    date.setMinutes(roundedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

// Helper: Format date for SolarEdge (YYYY-MM-DD HH:mm:ss)
function formatDate(date) {
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function getSolarEdgeData() {
    let connection;
    try {
        // 1. Connect to MySQL to get API keys
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT API_KEY, SITE_ID FROM Account_Solaredge');
        
        // 2. Calculate time range (Last 48 hours aligned to 15 min)
        // PHP logic: PT2880M = 48 hours. Logic seems to be "1 day ago" var name but 48h value.
        // We will stick to 48h to match PHP behavior.
        const now = new Date();
        const endTimeDate = roundTo15Minutes(new Date(now));
        
        const startTimeDate = new Date(endTimeDate);
        startTimeDate.setMinutes(startTimeDate.getMinutes() - 2880); // 48 hours back

        const startTime = formatDate(startTimeDate);
        const endTime = formatDate(endTimeDate);

        // 3. Fetch data for each site
        const energyPromises = rows.map(row => {
            const url = `${SOLAR_EDGE_API_BASEURL}/site/${row.SITE_ID}/energyDetails`;
            return axiosInstance.get(url, {
                params: {
                    meters: 'FeedIn',
                    timeUnit: 'QUARTER_OF_AN_HOUR',
                    api_key: row.API_KEY,
                    startTime: startTime,
                    endTime: endTime
                }
            }).then(res => res.data).catch(err => {
                console.error(`Error fetching energy for site ${row.SITE_ID}:`, err.message);
                return null;
            });
        });

        const powerPromises = rows.map(row => {
            const url = `${SOLAR_EDGE_API_BASEURL}/site/${row.SITE_ID}/powerDetails`;
            return axiosInstance.get(url, {
                params: {
                    meters: 'FeedIn',
                    timeUnit: 'QUARTER_OF_AN_HOUR',
                    api_key: row.API_KEY,
                    startTime: startTime,
                    endTime: endTime
                }
            }).then(res => res.data).catch(err => {
                 console.error(`Error fetching power for site ${row.SITE_ID}:`, err.message);
                 return null;
            });
        });

        const energyResponses = await Promise.all(energyPromises);
        const powerResponses = await Promise.all(powerPromises);

        // 4. Aggregate Data
        // Calculate number of 15-min intervals
        // (48 * 60) / 15 = 192 intervals
        const intervalsCount = (2880 / 15);
        
        const misure = [];
        let somma_totale_periodo = 0;

        for (let i = 0; i < intervalsCount; i++) {
            let somma_energia = 0;
            let somma_potenza = 0;
            
            // Calculate time for this interval
            const intervalTime = new Date(startTimeDate);
            intervalTime.setMinutes(intervalTime.getMinutes() + (i * 15));
            
            // Sum Energy
            for (const response of energyResponses) {
                if (response && response.energyDetails && response.energyDetails.meters[0].values[i]) {
                    const val = parseFloat(response.energyDetails.meters[0].values[i].value || 0);
                    somma_energia += (val / 1000); // Convert to unit? PHP does /1000. Assuming Wh -> kWh
                }
            }

            // Sum Power
            for (const response of powerResponses) {
                if (response && response.powerDetails && response.powerDetails.meters[0].values[i]) {
                    const val = parseFloat(response.powerDetails.meters[0].values[i].value || 0);
                    somma_potenza += (val / 1000); // PHP does /1000. W -> kW?
                }
            }

            const somma_round = parseFloat(somma_energia.toFixed(2));
            const potenza_round = parseFloat(somma_potenza.toFixed(2));
            
            somma_totale_periodo += somma_round;

            misure.push({
                data_ora: formatDate(intervalTime),
                somma_energia: somma_round,
                potenza: potenza_round
            });
        }

        return {
            misure,
            somma_totale_periodo: parseFloat(somma_totale_periodo.toFixed(2))
        };

    } catch (err) {
        console.error('Error in getSolarEdgeData:', err);
        throw err;
    } finally {
        if (connection) await connection.end();
    }
}

async function getInstantPowers() {
    try {
        const result = await getSolarEdgeData();
        
        // Match the previous return structure expected by server.js
        // Previous logic: sum of 'potenza' field in 'misure'
        // server.js expects: { data: misure, powerSum: ... }
        
        // HOWEVER, logic in previous server codes:
        // const sum = data.reduce((acc, item) => acc + item.potenza, 0);
        // This sums Power (kW) across all intervals. Which is physically meaningless as "Total Energy".
        // But the View displays it as "kWh".
        // The PHP script return 'somma_totale_periodo' which IS the energy sum.
        // It's vastly more likely that we should return the Energy Sum.
        // I will return the correct energy sum (somma_totale_periodo) as 'powerSum' to fix the display.
        
        return {
            data: result.misure,
            powerSum: result.somma_totale_periodo
        };

    } catch (error) {
        console.error('Failed to get aggregated data:', error);
        // Fallback or rethrow
        return { data: [], powerSum: 0 };
    }
}

module.exports = { getInstantPowers };