import { exec } from "child_process";
import { getSystemStats } from "../systemStatsExtractor/data.js";
import { allConstants } from "../constants/constant.js";
const terminalCommand = allConstants.terminalCommand;
const singaporeCarbonIntensity = allConstants.singaporeCarbonIntensity;
/**
 * Turns on the specified app and calculates energy consumption, CO2 emission, and power usage before and after startup.
 * @param appName - The name of the app to turn on.
 * @returns A promise that resolves to an object containing energy consumption, CO2 emission, and power usage values.
 */
export const turnOnApp = (appName) => {
    return new Promise((resolve, reject) => {
        let calculatedTotalEnergyWhileStartup = null;
        let calculatedCo2EmissionWhileStartup = null;
        let calculatedPowerInMWWhileStartup = null;
        let calculatedCo2EmissionAfterStartup = null;
        let calculatedTotalEnergyAfterStartup = null;
        let calculatedPowerInMWAfterStartup = null;
        const appInstance = exec(`open -a "${appName}"`, async (error, cmdOut, cmdErr) => {
            console.log(".................................");
            if (error) {
                console.error(`Error starting ${appName}: ${error.message}`);
                reject(error);
                return;
            }
            if (cmdErr) {
                console.error(`Error starting ${appName}: ${cmdErr}`);
                reject(new Error(cmdErr));
                return;
            }
            console.log(`${appName} started successfully`);
            try {
                const calculatedSystemStatsWithSoftwareWhileStartup = await getSystemStats(terminalCommand, singaporeCarbonIntensity);
                calculatedTotalEnergyWhileStartup =
                    calculatedSystemStatsWithSoftwareWhileStartup.calculatedTotalEnergy.toString();
                calculatedCo2EmissionWhileStartup =
                    calculatedSystemStatsWithSoftwareWhileStartup.calculatedCo2Emission.toString();
                calculatedPowerInMWWhileStartup =
                    calculatedSystemStatsWithSoftwareWhileStartup.combinedPowerInMW.toString();
            }
            catch (error) {
                reject(error);
            }
        });
        appInstance.on("exit", async (code) => {
            if (code === 0) {
                try {
                    const calculatedSystemStatsWithSoftwareAfterStartup = await getSystemStats(terminalCommand, singaporeCarbonIntensity);
                    calculatedTotalEnergyAfterStartup =
                        calculatedSystemStatsWithSoftwareAfterStartup.calculatedTotalEnergy.toString();
                    calculatedCo2EmissionAfterStartup =
                        calculatedSystemStatsWithSoftwareAfterStartup.calculatedCo2Emission.toString();
                    calculatedPowerInMWAfterStartup =
                        calculatedSystemStatsWithSoftwareAfterStartup.combinedPowerInMW.toString();
                    console.log("Operation Completed Successfully.");
                    resolve({
                        energyConsumedWhileStartup: calculatedTotalEnergyWhileStartup,
                        co2EmissionWhileStartup: calculatedCo2EmissionWhileStartup,
                        powerInMWWhileStartup: calculatedPowerInMWWhileStartup,
                        energyConsumedAfterStartup: calculatedTotalEnergyAfterStartup,
                        co2EmissionAfterStartup: calculatedCo2EmissionAfterStartup,
                        powerInMWAfterStartup: calculatedPowerInMWAfterStartup,
                    });
                    return {
                        energyConsumedWhileStartup: calculatedTotalEnergyWhileStartup,
                        co2EmissionWhileStartup: calculatedCo2EmissionWhileStartup,
                        powerInMWWhileStartup: calculatedPowerInMWWhileStartup,
                        energyConsumedAfterStartup: calculatedTotalEnergyAfterStartup,
                        co2EmissionAfterStartup: calculatedCo2EmissionAfterStartup,
                        powerInMWAfterStartup: calculatedPowerInMWAfterStartup,
                    };
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                console.error(`${appName} exited with code ${code}`);
                reject(new Error(`App exited with code ${code}`));
            }
        });
    });
};
