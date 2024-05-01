import { exec } from "child_process";
let startTime;
const calculateInJoules = (cpuPowerInMW, totalSec) => {
    // Takes raw power in milliwatts and converts to Joules which is the unit of energy
    const cpuPowerInWatts = cpuPowerInMW / 1000;
    const energyConsumptionJoules = cpuPowerInWatts * totalSec;
    return energyConsumptionJoules;
};
const calculateCarbonEmission = (energyConsumptionJoules, carbonIntensity) => {
    const energyConsumptionKWh = energyConsumptionJoules / 3600000; // Convert energy consumption to kWh
    const co2EmissionsGrams = energyConsumptionKWh * carbonIntensity; // CO2 emissions calculation based on carbon intensity
    return co2EmissionsGrams;
};
export const getSystemStats = (terminalCommand, carbonIntensity) => {
    return new Promise((resolve, reject) => {
        startTime = Date.now();
        exec(terminalCommand, (error, cmdOut, cmdErr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
            }
            else if (cmdErr) {
                console.error(`stderr: ${cmdErr}`);
                reject(cmdErr);
            }
            else {
                let endTime = Date.now();
                let totalSec = (endTime - startTime) / 1000; // Calculate elapsed time in seconds during data extraction
                let values = cmdOut.match(/\d+\.\d+|\d+/g);
                let cpuPowerInMW = parseInt(values[0]);
                let gpuPowerInMW = parseInt(values[1]);
                let combinedPowerInMW = parseInt(values[3]);
                const calculatedTotalEnergy = calculateInJoules(combinedPowerInMW, totalSec);
                const calculatedCPUEnergy = calculateInJoules(cpuPowerInMW, totalSec);
                const calculatedGPUEnergy = calculateInJoules(gpuPowerInMW, totalSec);
                const calculatedCo2Emission = calculateCarbonEmission(calculatedTotalEnergy, carbonIntensity);
                resolve({
                    calculatedTotalEnergy,
                    calculatedCo2Emission,
                    combinedPowerInMW,
                });
                return {
                    calculatedTotalEnergy,
                    calculatedCo2Emission,
                    combinedPowerInMW,
                };
            }
        });
    });
};
