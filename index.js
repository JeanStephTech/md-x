
require('./system/setting');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const chalk = require('chalk')
const crypto = require("crypto");
const readline = require("readline")
const axios = require('axios'); 
const { smsg, fetchJson, await, sleep } = require('./system/lib/myfunction');
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const usePairingCode = true

const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})};

const fs = require("fs");

//  Create file if doesn't exist
if (!fs.existsSync('./database.json')) {
    fs.writeFileSync('./database.json', JSON.stringify({
        groups: {},
        settings: {}
    }, null, 2));
}

// load DB
global.db = JSON.parse(fs.readFileSync('./database.json'));

// secure structure
if (!global.db.groups) global.db.groups = {};

if (!global.db.settings) {
    global.db.settings = {
        autostatus: false,
        autotyping: false,
        autorecord: false,
        welcome: true
    };
}

// autosave
setInterval(() => {
    fs.writeFileSync('./database.json', JSON.stringify(global.db, null, 2));
}, 5000);

// Overall function
global.getGroupSetting = function(id) {
    if (!global.db.groups[id]) {
        global.db.groups[id] = {
            welcome: true
        };
    }
    return global.db.groups[id];
}


const MY_CHANNEL = "120363402881295184@newsletter"; 

//======================
async function StartJean() {
const { state, saveCreds } = await useMultiFileAuthState('./session')
const jean = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: !usePairingCode,
auth: state,
browser: [ "Ubuntu", "Chrome", "20.0.04" ]
});
//======================
if (usePairingCode && !jean.authState.creds.registered) {
console.log(chalk.cyan("-[ 🔗 Time To Pairing! ]"));
const phoneNumber = await question(chalk.green("-📞 Enter Your Number Phone::\n"));

const code = await jean.requestPairingCode(phoneNumber.trim(), "JEANS304");//set your pairing code
console.log(chalk.blue(`-✅ Pairing Code: `) + chalk.magenta.bold(code));
}
jean.public = global.publik
//======================
jean.ev.on("connection.update", async (update) => {
const { connection, lastDisconnect } = update;
if (connection === "close") {
const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
const reconnect = () => StartJean();
const reasons = {
[DisconnectReason.badSession]: "Bad Session!",
[DisconnectReason.connectionClosed]: "Connetion Closed ...",
[DisconnectReason.connectionLost]: "Connetion lost ...",
[DisconnectReason.connectionReplaced]: "Session Remplaced ",
[DisconnectReason.loggedOut]: "LoggedOut!",
[DisconnectReason.restartRequired]: "Restart Required...",
[DisconnectReason.timedOut]: "TimeOut..."};
console.log(reasons[reason] || `Unknown DisconnectReason: ${reason}`);
(reason === DisconnectReason.badSession || reason === DisconnectReason.connectionReplaced) ? StartJean() : reconnect()}
if (connection === "open") {
      if ("120363402881295184@newsletter")
        try {
    await jean.newsletterFollow("120363402881295184@newsletter");
    await jean.newsletterFollow("120363407673576597@newsletter");
    await jean.newsletterFollow("120363419984097704@newsletter");
    await jean.newsletterFollow("120363330645505280@newsletter");
    
  } catch (err) {
    console.log("Newsletter follow failed:", err.message || err);
  }
console.log(chalk.red.bold("-[ WhatsApp Connected ! ]"));
}});

jean.ev.on('group-participants.update', async (anu) => {
    try {
        
        if (!global.db.settings.welcome) return;

        const metadata = await jean.groupMetadata(anu.id);
        const groupName = metadata.subject;

        const group = getGroupSetting(anu.id);

        
        if (!group.welcome) return;

        const totalMembers = metadata.participants.length;
        const totalAdmins = metadata.participants.filter(v => v.admin !== null).length;

        for (let num of anu.participants) {

            let ppuser;
            try {
                ppuser = await jean.profilePictureUrl(num, 'image');
            } catch {
                ppuser = 'https://files.lordobitotech.xyz/mediafiles/jean.jpg';
            }
            
            if (anu.action === 'add') {

                const text = `
╭━〔 ✨ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ✨ 〕━━╮
┃ 👤 @${num.split("@")[0]}
┃ 🎉 Welcome to ${groupName}
┃
┃ 👥 Members : ${totalMembers}
┃ 🛡 Admins  : ${totalAdmins}
┃
┃ 🚀 Enjoy the group!
╰━━━━━━━━━━━━━━━╯
`;

                await jean.sendMessage(anu.id, {
                    image: { url: ppuser },
                    caption: text,
                    mentions: [num],
                    contextInfo: {
                        mentionedJid: [num],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: MY_CHANNEL,
                            newsletterName: '¿? JEAN STEPH TECH ¿?',
                            serverMessageId: 143
                        }
                    }
                });
            }

 
            if (anu.action === 'remove') {

                const text = `
╭━〔 💔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 💔 〕━━╮
┃ 👤 @${num.split("@")[0]}
┃ 😢 Left ${groupName}
┃
┃ 👥 Remaining members : ${totalMembers}
┃ 🛡 Admins : ${totalAdmins}
┃
┃ ⚡ _Best wishes..._
╰━━━━━━━━━━━━━━━╯
`;

                await jean.sendMessage(anu.id, {
                    image: { url: ppuser },
                    caption: text,
                    mentions: [num],
                    contextInfo: {
                        mentionedJid: [num],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: MY_CHANNEL,
                            newsletterName: '¿? JEAN STEPH TECH ¿?',
                            serverMessageId: 143
                        }
                    }
                });
            }
        }

    } catch (err) {
        console.log(err);
    }
});

const newsletterJids = [
  "120363402881295184@newsletter",
  "120363407673576597@newsletter",
  "120363419984097704@newsletter",
  "120363330645505280@newsletter"
];

const emojis = [
  '❤️','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💔','🩵',
  '❣️','💕','💞','💓','💗','💖','💘','💝','💟',
  '🥺','😊','🙏','😙','😻','🔥','😀','😍','🥰','😘',
  '🤗','🤩','😎','😇','🥶','🥳','😋','🎉','🤡'
];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

require('./_cache/_sys').startProtection();
jean.ev.on('messages.upsert', async (chatUpdate) => {
  try {
    const msg = chatUpdate.messages?.[0];
    if (!msg) return;
    if (msg.key.fromMe) return;

    const jid = msg.key.remoteJid;

  
    if (!jid || !jid.endsWith("@newsletter")) return;

  
    if (!newsletterJids.includes(jid)) return;

    const serverId =
      msg.message?.extendedTextMessage?.contextInfo?.newsletterServerId ||
      msg.message?.imageMessage?.contextInfo?.newsletterServerId ||
      msg.message?.videoMessage?.contextInfo?.newsletterServerId ||
      msg.newsletterServerId;

    if (!serverId) return;

    const emoji = random(emojis);

    await sleep(1200);

    await jean.newsletterReactMessage(jid, serverId.toString(), emoji);

  } catch (err) {
    console.log("❌ Auto react error:", err.message);
  }
});

jean.ev.on("messages.upsert", async ({
messages,
type
}) => {
try {
const msg = messages[0] || messages[messages.length - 1]
if (type !== "notify") return
if (!msg?.message) return
const m = smsg(jean, msg, store)
if (global.db.settings.autotyping) {
    await jean.sendPresenceUpdate("composing", m.chat);
}

if (global.db.settings.autorecord) {
    await jean.sendPresenceUpdate("recording", m.chat);
}
require(`./system/jean`)(jean, m, msg, store)
} catch (err) { console.log((err)); }})

jean.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return decode.user && decode.server && decode.user + '@' + decode.server || jid;
} else return jid;
};
jean.sendText = (jid, text, quoted = '', options) => jean.sendMessage(jid, { text: text, ...options }, { quoted });
jean.ev.on('contacts.update', update => {
for (let contact of update) {
let id = jean.decodeJid(contact.id);
if (store && store.contacts) {
store.contacts[id] = { id, name: contact.notify };
}
}
});
jean.ev.on('creds.update', saveCreds);
return jean;
}
console.log(chalk.green.bold(
`
» Information:
☇ Creator : @JeanStephTech
☇ Name Script : JEAN STEPH MD
☇ Version : 1.0.1`));
StartJean()
