const os = require("os");

const startTime = new Date(); // সার্ভার শুরু হওয়ার সময়

module.exports = {
  config: {
    name: "uptime",
    version: "1.0.4", // সংস্করণ আপডেট করা হলো
    hasPermission: 0,
    credits: "SHIFAT",
    description: "বটের আপটাইম এবং সিস্টেমের তথ্য দেখুন।",
    commandCategory: "box",
    usages: "uptime",
    prefix: "false",
    cooldowns: 5
  },

  run: async function ({ api, event }) {
    try {
      // প্রথমে একটি লোডিং মেসেজ পাঠিয়ে তার আইডি নেওয়া হলো
      const messageID = (await api.sendMessage("⏳ | Uptime এবং সিস্টেমের তথ্য লোড হচ্ছে...", event.threadID)).messageID;

      // একটি হেল্পার ফাংশন যা মেসেজ এডিট করবে এবং কিছুটা দেরি করবে
      const editMessageWithDelay = async (text, delay) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        // মেসেজ এডিট করার সময় কোনো সমস্যা হলে যেন ক্র্যাশ না করে
        try {
          await api.editMessage(text, messageID);
        } catch (e) {
          console.error("মেসেজ এডিট করা সম্ভব হয়নি:", e);
        }
      };

      // ধাপ ১: প্রসেসিং শুরু
      await editMessageWithDelay("[█░░░░░░░░░] 10%\nপ্রসেসিং শুরু হচ্ছে...", 800);

      // ধাপ ২: আপটাইম গণনা
      const uptimeInSeconds = Math.floor((new Date() - startTime) / 1000);
      const days = Math.floor(uptimeInSeconds / (3600 * 24));
      const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
      const secondsLeft = uptimeInSeconds % 60;
      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;
      await editMessageWithDelay("[███░░░░░░░] 30%\nআপটাইম গণনা করা হচ্ছে...", 800);
      
      // ধাপ ৩: মেমোরির তথ্য সংগ্রহ
      const totalMemoryGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
      const freeMemoryGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
      const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);
      await editMessageWithDelay("[██████░░░░░] 60%\nমেমোরির তথ্য সংগ্রহ করা হচ্ছে...", 800);

      // ধাপ ৪: সবকিছু একত্রিত করা
      await editMessageWithDelay("[█████████░] 90%\nসবকিছু একত্রিত করা হচ্ছে...", 800);

      // ধাপ ৫: সম্পন্ন মেসেজ দেখানো
      await editMessageWithDelay("[██████████] 100%\nসম্পন্ন!", 800);

      // ধাপ ৬: চূড়ান্ত বার্তা তৈরি
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
      
      // চূড়ান্ত তথ্য দেখানোর জন্য শেষবার মেসেজ এডিট করা
      await editMessageWithDelay(systemInfo, 500);

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
