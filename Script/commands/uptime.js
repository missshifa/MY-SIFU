const os = require("os");

const startTime = new Date(); // Server start time

module.exports = {
  config: {
    name: "uptime",
    version: "1.0.1",
    hasPermission: 0,
    credits: "Fixed by SHIFAT",
    description: "Check the bot uptime and system information.",
    commandCategory: "box",
    usages: "uptime",
    prefix: "false",
    dependencies: {},
    cooldowns: 5
  },

  run: async function ({ api, event }) {
    try {
      // Show animated loading first
      const loadingMessage = await displayLoading(api, event);

      // Calculate uptime
      const uptimeInSeconds = Math.floor((new Date() - startTime) / 1000);
      const days = Math.floor(uptimeInSeconds / (3600 * 24));
      const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
      const secondsLeft = uptimeInSeconds % 60;
      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;

      // Calculate system information
      const totalMemoryGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
      const freeMemoryGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
      const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);

      // Create final message
      const systemInfo = `
♡  ∩_∩   （„• ֊ •„)♡
╭─∪∪────────────⟡
│───꯭─⃝‌‌𝗦𝗜𝗙𝗨 𝗕𝗢𝗧───
├───────────────⟡
│ 🖥️📡 ℝ𝕌ℕ𝕋𝕀𝕄𝔼
│ ${uptimeFormatted}
│ 💾📽️ 𝕄𝔼𝕄𝕆ℝ𝕐
│ 𝚃𝙾𝚃𝙰𝙻: ${totalMemoryGB} 𝙶𝙱
│ 𝙵𝚁𝙴𝙴: ${freeMemoryGB} 𝙶𝙱
│ 𝚄𝚂𝙴𝙳: ${usedMemoryGB} 𝙶𝙱
╰───────────────⟡
`;

      // Replace loading bar with system info
      await api.editMessage(loadingMessage.messageID, systemInfo);

    } catch (error) {
      console.error("Error retrieving system information:", error);
      api.sendMessage(
        "Unable to retrieve system information.",
        event.threadID,
        event.messageID
      );
    }
  }
};

async function displayLoading(api, event) {
  // Initial message with progress bar at 10%
  const sentMessage = await api.sendMessage("[█░░░░░░░░░░] 10%", event.threadID);

  // Progress bar steps
  const steps = [
    { bar: "[███░░░░░░░░]", percent: "30%" },
    { bar: "[██████░░░░░]", percent: "60%" },
    { bar: "[█████████░░]", percent: "90%" },
    { bar: "[███████████]", percent: "100%" },
  ];

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec delay
    try {
      await api.editMessage(sentMessage.messageID, `${step.bar} ${step.percent}`);
    } catch (error) {
      console.error("Edit failed:", error);
    }
  }

  return sentMessage; // Return sent message
}
