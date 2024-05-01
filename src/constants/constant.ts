const terminalCommand = `sudo powermetrics -n 1 | grep "mW"`;
const singaporeCarbonIntensity = 0.4057; //kgCO2eq/kWh
const appToInvoke = "Spotify"; // Any exact name of the software to test co2 emission

export const allConstants = {
  terminalCommand,
  singaporeCarbonIntensity,
  appToInvoke,
};
