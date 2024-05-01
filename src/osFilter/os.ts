import os from "os";

/**
 * Checks if the current operating system is macOS.
 * @returns {boolean} Returns true if the operating system is macOS, otherwise returns false.
 */
export const checkIfMacOS = () => {
  const platform = os.platform();
  if (platform === "darwin") {
    return true;
  } else {
    return false;
  }
};
