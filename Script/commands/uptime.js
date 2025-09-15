const os = require("os");

const startTime = new Date(); // সার্ভার শুরু হওয়ার সময়

module.exports = {
  config: {
    name: "uptime",
    version: "1.0.3", // সংস্করণ আপডেট করা হলো
    hasPermission: 0,
    credits: "Fixed by SHIFAT & Gemini",
    description: "বটের আপটাইম এবং সিস্টেমের তথ্য দেখুন।",
    commandCategory: "box",
    usages: "uptime",
    prefix: "false",
    cooldowns: 5
  },

  run: async function ({ api, event }) {
    try {
      // প্রথমে একটি লোডিং মেসেজ পাঠানো হলো
      const loadingMessage = await api.sendMessage("⏳ | Uptime এবং সিস্টেমের তথ্য লোড হচ্ছে...", event.threadID);
      
      // একটি অ্যানিমেটেড লোডিং ফাংশন কল করা হলো
      await displayLoading(api, loadingMessage.messageID);

      // আপটাইম গণনা
      const uptimeInSeconds = Math.floor((new Date() - startTime) / 1000);
      const days = Math.floor(uptimeInSeconds / (3600 * 24));
      const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
      const secondsLeft = uptimeInSeconds % 60;
      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;

      // সিস্টেমের তথ্য গণনা
      const totalMemoryGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
      const freeMemoryGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
      const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);

      // চূড়ান্ত বার্তা তৈরি
      const systemInfo = `
♡  ∩_∩   （„• ֊ •„)♡
╭─∪∪────────────⟡
│ 𝗨𝗣𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢
├───────────────⟡
│ ⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘
│ ${uptimeFormatted}
│ 💻 𝗠𝗘𝗠𝗢𝗥𝗬
│ Total: ${totalMemoryGB} GB
│ Free: ${freeMemoryGB} GB
│ Used: ${usedMemoryGB} GB
╰───────────────⟡
`;

      // লোডিং সম্পন্ন হওয়ার পর চূড়ান্ত মেসেজটি পাঠানো
      // একটি ছোট ডিলে দেওয়া হলো যাতে API ঠিকভাবে কাজ করতে পারে
      setTimeout(() => {
        api.editMessage(systemInfo, loadingMessage.messageID);
      }, 500); // ০.৫ সেকেন্ড পর মেসেজ এডিট হবে

    } catch (error) {
      console.error("সিস্টেমের তথ্য আনতে সমস্যা হয়েছে:", error);
      api.sendMessage(
        "সিস্টেমের তথ্য আনা সম্ভব হচ্ছে না।",
        event.threadID,
        event.messageID
      );
    }
  }
};

// এই ফাংশনটি এখন শুধু অ্যানিমেশন দেখাবে
async function displayLoading(api, messageID) {
  const steps = [
    { bar: "[█░░░░░░░░░░] 10%", text: "প্রসেসিং শুরু হচ্ছে..." },
    { bar: "[███░░░░░░░░]", percent: "30%", text: "আপটাইম গণনা করা হচ্ছে..." },
    { bar: "[██████░░░░░]", percent: "60%", text: "মেমোরির তথ্য সংগ্রহ করা হচ্ছে..." },
    { bar: "[█████████░░]", percent: "90%", text: "সবকিছু একত্রিত করা হচ্ছে..." },
    { bar: "[███████████]", percent: "100%", text: "সম্পন্ন!" },
  ];

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, 800)); // প্রতিটি ধাপের মধ্যে ০.৮ সেকেন্ড অপেক্ষা
    try {
      if (messageID) {
        await api.editMessage(`${step.bar} ${step.percent}\n${step.text}`, messageID);
      }
    } catch (error) {
      // যদি মেসেজ এডিট করতে সমস্যা হয়, তাহলে এখানেই থেমে যাবে
      // কিন্তু মূল ফাংশন কাজ চালিয়ে যাবে
      console.error("মেসেজ এডিট করতে সমস্যা:", error);
      break; 
    }
  }
}
