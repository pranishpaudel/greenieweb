import { getSystemStats } from "./systemStatsExtractor/data.js";
import { turnOnApp } from "./invokeSoftware/run.js";
import { allConstants } from "./constants/constant.js";
const terminalCommand = allConstants.terminalCommand;
const singaporeCarbonIntensity = allConstants.singaporeCarbonIntensity; //kgCO2eq/kWh
const appToInvoke = allConstants.appToInvoke; // Any exact name of the software to test co2 emission
/**
 * Calculates the system and software statistics related to energy consumption, CO2 emissions, and power.
 * @param appNameToInvoke - The name of the application to invoke.
 * @returns A promise that resolves to an object containing the calculated system and software statistics.
 */
export const startFunctionality = async (appNameToInvoke) => {
    const calculatedRawSystemStats = await getSystemStats(terminalCommand, singaporeCarbonIntensity);
    const calculatedTotalEnergy = calculatedRawSystemStats.calculatedTotalEnergy.toString();
    const calculatedCo2Emission = calculatedRawSystemStats.calculatedCo2Emission.toString();
    const calculatedPowerinMW = calculatedRawSystemStats.combinedPowerInMW.toString();
    const invokeApp = await turnOnApp(appNameToInvoke);
    const energyConsumedWhileStartup = invokeApp.energyConsumedWhileStartup;
    const co2EmissionWhileStartup = invokeApp.co2EmissionWhileStartup;
    const powerInMWWhileStartup = invokeApp.powerInMWWhileStartup;
    const energyConsumedAfterStartup = invokeApp.energyConsumedAfterStartup;
    const co2EmissionAfterStartup = invokeApp.co2EmissionAfterStartup;
    const powerInMWAfterStartup = invokeApp.powerInMWAfterStartup;
    const calculatedSoftwarePowerInMWWhileStartup = parseFloat(powerInMWWhileStartup) - parseFloat(calculatedPowerinMW);
    const calculatedSoftwarePowerInMWAfterStartup = parseFloat(powerInMWAfterStartup) - parseFloat(calculatedPowerinMW);
    const calculatedSoftwareEnergyConsumedWhileStartup = parseFloat(energyConsumedWhileStartup) - parseFloat(calculatedTotalEnergy);
    const calculatedSoftwareEnergyConsumedAfterStartup = parseFloat(energyConsumedAfterStartup) - parseFloat(calculatedTotalEnergy);
    const calculatedSoftwareCo2EmissionWhileStartup = parseFloat(co2EmissionWhileStartup) - parseFloat(calculatedCo2Emission);
    const calculatedSoftwareCo2EmissionAfterStartup = parseFloat(co2EmissionAfterStartup) - parseFloat(calculatedCo2Emission);
    return {
        TotalPowerinMWRaw: calculatedPowerinMW,
        TotalEnergyRaw: calculatedTotalEnergy,
        TotalCo2EmissionRaw: calculatedCo2Emission,
        SoftwarePowerWhileStartup: calculatedSoftwarePowerInMWWhileStartup.toString(),
        SoftwarePowerAfterStartup: calculatedSoftwarePowerInMWAfterStartup.toString(),
        SoftwareEnergyWhileStartup: calculatedSoftwareEnergyConsumedWhileStartup.toString(),
        SoftwareEnergyAfterStartup: calculatedSoftwareEnergyConsumedAfterStartup.toString(),
        SoftwareCo2WhileStartup: calculatedSoftwareCo2EmissionWhileStartup.toString(),
        SoftwareCo2AfterStartup: calculatedSoftwareCo2EmissionAfterStartup.toString(),
    };
};
