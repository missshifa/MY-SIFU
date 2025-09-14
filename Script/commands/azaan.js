const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');

module.exports.config = {
    name: 'azaan',
    version: '12.0.0',
    hasPermssion: 0,
    credits: 'SIFAT',
    description: 'Automatically sends prayer reminders at scheduled times (BD Time) and shows prayer times.',
    commandCategory: 'group messenger',
    usages: '[tomorrow]',
    cooldowns: 3
};

// ডিজিটাল স্টাইল নামাজ রিমাইন্ডার মেসেজ
const messages = [
    { 
        time: '4:45 AM', 
        message: "┏━━━━━━━━━━━━━━┓\n" +
                 "    🌙 ফজর নামাজ 🕌\n" +
                 "┗━━━━━━━━━━━━━━┛\n\n" +
                 "🔔 আস-সালাতু খাইরুম মিনান নাউম\n" +
                 "✨ এখন ফজর নামাজের সময়।\n\n" +
                 "🕋 স্নিগ্ধ ভোরের এই পবিত্র মুহূর্তে\n" +
                 "মহান আল্লাহর দরবারে সিজদাহ করে দিনের সূচনা করুন।"
    },
    { 
        time: '1:00 PM', 
        message: "┏━━━━━━━━━━━━━━┓\n" +
                 "     ☀️ যোহর নামাজ 🕌\n" +
                 "┗━━━━━━━━━━━━━━┛\n\n" +
                 "🔔 এখন যোহরের নামাজের সময়।\n\n" +
                 "📿 কর্মব্যস্ততার মাঝে একটু থেমে\n" +
                 "আখেরাতের প্রস্তুতি নিন।\n" +
                 "🤲 আল্লাহ আপনার প্রতি সহায় হোন।"
    },
    { 
        time: '4:40 PM', 
        message: "┏━━━━━━━━━━━━━━┓\n" +
                 "     🌇 আসর নামাজ 🕌\n" +
                 "┗━━━━━━━━━━━━━━┛\n\n" +
                 "🔔 এখন আসরের নামাজের সময়।\n\n" +
                 "📿 দিনের শেষভাগে শুকরিয়া আদায় করুন\n" +
                 "🌸 নিশ্চয়ই আল্লাহ পরম করুণাময়।"
    },
    { 
        time: '6:20 PM', 
        message: "┏━━━━━━━━━━━━━━┓\n" +
                 "   🌆 মাগরিব নামাজ 🕌\n" +
                 "┗━━━━━━━━━━━━━━┛\n\n" +
                 "🔔 সূর্য অস্ত হয়েছে, এখন মাগরিবের সময়।\n\n" +
                 "👨‍👩‍👧‍👦 পরিবার নিয়ে নামাজ আদায় করুন\n" +
                 "🤲 আল্লাহর কাছে দোয়া করুন।"
    },
    { 
        time: '7:35 PM', 
        message: "┏━━━━━━━━━━━━━━┓\n" +
                 "     🌙 এশা নামাজ 🕌\n" +
                 "┗━━━━━━━━━━━━━━┛\n\n" +
                 "🔔 এখন এশার নামাজের সময়।\n\n" +
                 "✨ দিনশেষের প্রশান্তিতে ইবাদত করুন\n" +
                 "🕋 আল্লাহ আমাদের ইবাদত কবুল করুন।"
    }
];

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ NAMAZ REMINDER LOADED (BD TIME) ============"));

    messages.forEach(({ time, message }) => {
        const parsed = moment.tz(time, "h:mm A", "Asia/Dhaka");

        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Dhaka';
        rule.hour = parsed.hour();
        rule.minute = parsed.minute();

        schedule.scheduleJob(rule, () => {
            if (!global.data?.allThreadID) return;
            global.data.allThreadID.forEach(threadID => {
                api.sendMessage(message, threadID, (error) => {
                    if (error) {
                        console.error(`Failed to send message to ${threadID}:`, error);
                    }
                });
            });
        });

        console.log(chalk.hex("#00FFFF")(`Scheduled (BDT): ${parsed.format("h:mm A")} => ${message}`));
    });
};

module.exports.run = ({ api, event, args }) => {
    // এই সময়গুলো উদাহরণ হিসেবে ব্যবহার করা হয়েছে।
    // আপনার এলাকার সঠিক সময় অনুযায়ী এগুলো পরিবর্তন করতে পারেন।
    const todayTimes = {
        'ফজর': '04:33 AM', 
        'যোহর': '01:01 PM', 
        'আসর': '04:27 PM', 
        'মাগরিব': '06:14 PM', 
        'এশা': '07:35 PM'
    };

    const tomorrowTimes = {
        'ফজর': '04:33 AM', 
        'যোহর': '01:01 PM', 
        'আসর': '04:27 PM', 
        'মাগরিব': '06:14 PM', 
        'এশা': '07:36 PM'
    };
    
    let prayerTimes;
    let messageHeader;
    const today = moment.tz("Asia/Dhaka").format("DD-MM-YYYY");
    const tomorrow = moment.tz("Asia/Dhaka").add(1, 'days').format("DD-MM-YYYY");

    if (args[0]?.toLowerCase() === 'tomorrow') {
        prayerTimes = tomorrowTimes;
        messageHeader = `🗓️ আগামীকালের (${tomorrow}) নামাজের সময়সূচি:`;
    } else {
        prayerTimes = todayTimes;
        messageHeader = `🗓️ আজকের (${today}) নামাজের সময়সূচি:`;
    }
    
    let prayerMessage = `${messageHeader}\n\n`;
    for (const prayer in prayerTimes) {
        prayerMessage += `🕌 ${prayer}: ${prayerTimes[prayer]}\n`;
    }
    
    api.sendMessage(prayerMessage, event.threadID, event.messageID);
};
