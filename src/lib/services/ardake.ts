import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { getMysqlConnection } from '../mysql';

// Cache setup for external SolarEdge calls
const axiosInstance = setupCache(axios, {
    ttl: 60 * 1000 * 5, // 5 minutes cache
    interpretHeader: false
});

const SOLAR_EDGE_API_BASEURL = 'https://monitoringapi.solaredge.com';

// Interfaces
interface SolarEdgeAccount {
    API_KEY: string;
    SITE_ID: string;
}

interface MeterResponse {
    energyDetails?: { meters: { values: { value: number }[] }[] };
    powerDetails?: { meters: { values: { value: number }[] }[] };
}

// Helper: Round date to nearest 15 minutes
function roundTo15Minutes(date: Date) {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.floor(minutes / 15) * 15;
    date.setMinutes(roundedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

// Helper: Format date for SolarEdge (YYYY-MM-DD HH:mm:ss)
function formatDate(date: Date) {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function getSolarEdgeData() {
    let connection;
    try {
        // 1. Connect to MySQL to get API keys
        connection = await getMysqlConnection();

        if (!connection) {
            console.warn('Skipping SolarEdge data fetch: No database connection.');
            return { misure: [], somma_totale_periodo: 0 };
        }

        const [rows] = await connection.execute('SELECT API_KEY, SITE_ID FROM Account_Solaredge');
        const accounts = rows as SolarEdgeAccount[];

        // 2. Calculate time range (Last 48 hours aligned to 15 min)
        const now = new Date();
        const endTimeDate = roundTo15Minutes(new Date(now));

        const startTimeDate = new Date(endTimeDate);
        startTimeDate.setMinutes(startTimeDate.getMinutes() - 2880); // 48 hours back

        const startTime = formatDate(startTimeDate);
        const endTime = formatDate(endTimeDate);

        // 3. Fetch data for each site
        const energyPromises = accounts.map(row => {
            const url = `${SOLAR_EDGE_API_BASEURL}/site/${row.SITE_ID}/energyDetails`;
            return axiosInstance.get(url, {
                params: {
                    meters: 'FeedIn',
                    timeUnit: 'QUARTER_OF_AN_HOUR',
                    api_key: row.API_KEY,
                    startTime: startTime,
                    endTime: endTime
                }
            }).then(res => res.data as MeterResponse).catch(err => {
                console.error(`Error fetching energy for site ${row.SITE_ID}:`, err.message);
                return null;
            });
        });

        const powerPromises = accounts.map(row => {
            const url = `${SOLAR_EDGE_API_BASEURL}/site/${row.SITE_ID}/powerDetails`;
            return axiosInstance.get(url, {
                params: {
                    meters: 'FeedIn',
                    timeUnit: 'QUARTER_OF_AN_HOUR',
                    api_key: row.API_KEY,
                    startTime: startTime,
                    endTime: endTime
                }
            }).then(res => res.data as MeterResponse).catch(err => {
                console.error(`Error fetching power for site ${row.SITE_ID}:`, err.message);
                return null;
            });
        });

        const energyResponses = await Promise.all(energyPromises);
        const powerResponses = await Promise.all(powerPromises);

        // 4. Aggregate Data
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
                if (response?.energyDetails?.meters[0]?.values[i]) {
                    const val = Number(response.energyDetails.meters[0].values[i].value || 0);
                    somma_energia += (val / 1000);
                }
            }

            // Sum Power
            for (const response of powerResponses) {
                if (response?.powerDetails?.meters[0]?.values[i]) {
                    const val = Number(response.powerDetails.meters[0].values[i].value || 0);
                    somma_potenza += (val / 1000);
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

export async function getInstantPowers() {
    try {
        const result = await getSolarEdgeData();
        return {
            data: result.misure,
            powerSum: result.somma_totale_periodo
        };
    } catch (error) {
        console.error('Failed to get aggregated data:', error);
        return { data: [], powerSum: 0 };
    }
}
