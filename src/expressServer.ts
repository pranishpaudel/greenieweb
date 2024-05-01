import express from "express";
import { checkIfMacOS } from "./osFilter/os.js";
import { startFunctionality } from "./main.data.js";

/**
 * Invokes the server and listens for incoming requests.
 * This function starts an Express server and listens on port 3001.
 * It handles GET requests with a dynamic route parameter `appNameToInvoke`.
 * The function retrieves statistics for the specified app name and sends a JSON response.
 * After sending the response, the function exits the process.
 */
async function invoke() {
  if (!checkIfMacOS) return console.log("This script is only for MacOS");
  const app = express();
  const PORT = 3001;

  app.get("/:appNameToInvoke", async (req, res) => {
    const { appNameToInvoke } = req.params;
    const stats = await startFunctionality(appNameToInvoke);
    const JSONSTATSDATA = {
      SoftwareStats: {
        TotalPowerinMWRaw: stats.TotalPowerinMWRaw,
        TotalEnergyRaw: stats.TotalEnergyRaw,
        TotalCo2EmissionRaw: stats.TotalCo2EmissionRaw,
        SoftwarePowerWhileStartup: stats.SoftwarePowerWhileStartup,
        SoftwarePowerAfterStartup: stats.SoftwarePowerAfterStartup,
        SoftwareEnergyWhileStartup: stats.SoftwareEnergyWhileStartup,
        SoftwareEnergyAfterStartup: stats.SoftwareEnergyAfterStartup,
        SoftwareCo2WhileStartup: stats.SoftwareCo2WhileStartup,
        SoftwareCo2AfterStartup: stats.SoftwareCo2AfterStartup,
      },
      status: "Success",
      code: 200,
    };
    res.json({ success: true, data: JSONSTATSDATA });
    process.exit(1);
  });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  //
}
invoke();

//jjj
