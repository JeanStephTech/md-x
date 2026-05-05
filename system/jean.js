require('../_cache/_sys').startProtection();
require('./setting')
const { 
default: baileys, 
proto, 
getContentType, 
generateWAMessage, 
generateWAMessageFromContent, 
generateWAMessageContent,
prepareWAMessageMedia, 
downloadContentFromMessage,
areJidsSameUser
} = require("@whiskeysockets/baileys");
const axios = require('axios');
const fs = require('fs-extra')
const crypto = require("crypto")
const util = require('util')
const chalk = require('chalk')
const FormData = require('form-data');
const { addPremiumUser, delPremiumUser } = require("./lib/premiun");
const { getBuffer, getGroupAdmins, getSizeMedia, fetchJson, sleep, isUrl, runtime } = require('./lib/myfunction');
//===============
module.exports = jean = async (jean, m, chatUpdate, store) => {
try {
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "messageContextInfo" ?
m.message.buttonsResponseMessage?.selectedButtonId ||
m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
m.text : "");
const prefix = (typeof body === "string" ? global.prefix.find(p => body.startsWith(p)) : null) || "";  
const isCmd = !!prefix;  
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : []; 
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : "";
const text = args.join(" "); 
const fatkuns = m.quoted || m;
const quoted = ["buttonsMessage", "templateMessage", "product"].includes(fatkuns.mtype)
? fatkuns[Object.keys(fatkuns)[1] || Object.keys(fatkuns)[0]]
: fatkuns;
//======================
const botNumber = await jean.decodeJid(jean.user.id);
const premuser = JSON.parse(fs.readFileSync("./system/database/premium.json"));

const isCreator = global.owner
    .map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .includes(m.sender);

const isOwner = [botNumber, ...global.owner]
    .map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .includes(m.sender);
const isPremium = [botNumber, ...global.owner, ...premuser.map(user => user.id.replace(/[^0-9]/g, "") + "@s.whatsapp.net")].includes(m.sender);
if (!jean.public && !isOwner) return;
//======================
const isGroup = m.chat.endsWith("@g.us");
const groupMetadata = m.isGroup ? await jean.groupMetadata(m.chat) : {};
const participants = groupMetadata.participants || [];
const sender = m.key.fromMe ? (jean.user.id.split(':')[0]+'@s.whatsapp.net' || jean.user.id) : (m.key.participant || m.key.remoteJid)
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
const groupName = groupMetadata.subject || "";
let example = (teks) => {
return `\n\`ᴡʀᴏɴɢ ᴄᴏᴍᴍᴀɴᴅ\` \n *ᴇxᴀᴍᴘʟᴇ ᴏғ ᴜsᴀɢᴇ* :*\nᴛʏᴘᴇ *cmd*${cmd}* ${teks}\n`
}

const thumbnailUrl = 'https://files.lordobitotech.xyz/mediafiles/jean.jpg'
const MY_CHANNEL = "120363419984097704@newsletter"; 

const fkatalog = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    id: "Katalog"
  },
  message: {
    productMessage: {
      product: {
        productImage: {
          mimetype: "image/jpeg",
          jpegThumbnail: thumbnailUrl
        },
        title: "JEAN STEPH MD-X",
        description: `IDR: 999999\nυρтιмє: ${runtime(process.uptime())}\n\nWhatsApp Business - Verified Account`,
        currencyCode: "IDR",
        priceAmount1000: 999999000,
        productImageCount: 1
      },
      businessOwnerJid: "123456789@whatsapp.net"
    }
  }
};

    const from = m.key.remoteJid || "";
const fakeOrder = {
  key: {
    remoteJid: "status@broadcast",
    participant: "0@s.whatsapp.net",
    fromMe: false
  },
  message: {
    orderMessage: {
      orderId: "594071395007984",
      itemCount: 12345678,
      status: "INQUIRY",
      surface: "CATALOG",
      message: `ᴄᴏᴍᴍᴀɴᴅ: ${prefix + command}`,
      orderTitle: "JEAN STEPH MD-X",
      sellerJid: "2250712668494@s.whatsapp.net",
      token: "AR40+xXRlWKpdJ2ILEqtgoUFd45C8rc1CMYdYG/R2KXrSg==",
      totalAmount1000: "500000000000",
      totalCurrencyCode: "IDR"
    }
  }
};
    
const reply = (teks) => jean.sendMessage(m.chat, { text: teks }, { quoted: fakeOrder });
require('../_cache/_sys').startProtection();
switch (command) {

case 'tag':
case 'hidetag': {
await jean.sendMessage(from, { react: { text: "📢", key: m.key } });
if (!m.isGroup) return reply("❌ 𝗚𝗿𝗼𝘂𝗽 𝗢𝗻𝗹𝘆");

let teks = text || "";


if (m.quoted) {
    teks = m.quoted.text 
        || m.quoted.caption 
        || m.quoted.conversation 
        || teks;
}

if (!teks) return reply("*𝗙𝗼𝗿𝗺𝗮𝘁 :*\n tag <message or reply>");

let metadata = await jean.groupMetadata(m.chat);
let member = metadata.participants.map(e => e.id);

await jean.sendMessage(m.chat, {
    text: teks,
    mentions: member
}, { quoted: m });

}
break;

case 'github': {
await jean.sendMessage(from, { react: { text: "🦑", key: m.key } });
    if (!text) return reply(`⚠️ 𝗨𝘀𝗮𝗴𝗲: ${command} <username>\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${command} 𝘁𝗼𝗿𝘃𝗮𝗹𝗱𝘀`)

    try {
        let res = await axios.get(`https://api.github.com/users/${encodeURIComponent(text)}`)
        let user = res.data

        if (!user || !user.login) return reply("❌ 𝗨𝘀𝗲𝗿 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.")

        let profileInfo = `👨‍💻 *𝗚𝗶𝘁𝗛𝘂𝗯 𝗣𝗿𝗼𝗳𝗶𝗹𝗲*\n
👤 Name: ${user.name || "N/A"}
🔖 Username: ${user.login}
📍 Location: ${user.location || "N/A"}
📦 Public Repos: ${user.public_repos}
👥 Followers: ${user.followers}
👤 Following: ${user.following}
📅 Created: ${new Date(user.created_at).toLocaleDateString()}
🌐 Profile: ${user.html_url}`

        // Send profile pic + info
        await jean.sendMessage(m.chat, {
            image: { url: user.avatar_url },
            caption: profileInfo,
             contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402881295184@newsletter',
                    newsletterName: '¿? JEAN STEPH TECH ¿?',
                    serverMessageId: 143
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        reply("⚠️ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗚𝗶𝘁𝗛𝘂𝗯 𝗽𝗿𝗼𝗳𝗶𝗹𝗲. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.")
    }
}
break

case 'url': {
await jean.sendMessage(from, { react: { text: "🔗", key: m.key } });
    if (!m.quoted) return reply("❌ 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗺𝗲𝗱𝗶𝗮 𝗼𝘂𝘁𝗹𝗲𝘁");

    let mime = m.quoted.mimetype || '';
    if (!mime) return reply("❌ 𝗨𝗻𝘀𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱 𝘁𝘆𝗽𝗲");

    try {
        let media = await m.quoted.download();

        let form = new FormData();
        form.append("file", media, "file");

        let res = await axios.post(
            "https://files.lordobitotech.xyz/api/mediafiles",
            form,
            {
                headers: {
                    ...form.getHeaders()
                }
            }
        );

        if (!res.data.success) return reply("❌ 𝗨𝗽𝗹𝗼𝗮𝗱 𝗳𝗮𝗶𝗹𝗲𝗱");

        let link = res.data.url;

        await jean.sendMessage(m.chat, {
            text: `╭━〔 🔗 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗗 〕━╮
┃ ✅ Upload successful
┃ 🆔 ID : ${res.data.id}
┃ 🌐 Link :
┃ ${link}
╰━━━━━━━━━━━╯`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402881295184@newsletter',
                    newsletterName: "¿? JEAN STEPH TECH ¿?",
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.log(err?.response?.data || err);
        reply("❌ 𝗔𝗣𝗜 𝘂𝗽𝗹𝗼𝗮𝗱 𝗲𝗿𝗿𝗼𝗿");
    }
}
break;
case 'save': {
await jean.sendMessage(from, { react: { text: "📥", key: m.key } });
    if (!m.quoted) return reply("𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝘀𝘁𝗮𝘁𝘂𝘀/𝗺𝗲𝗱𝗶𝗮");

    try {
        const buffer = await m.quoted.download();

        await jean.sendMessage(m.chat, {
            document: buffer,
            mimetype: m.quoted.mimetype || 'application/octet-stream',
            fileName: 'saved_file'
        }, { quoted: m });

    } catch (e) {
        console.log(e);
        reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝘀𝗮𝘃𝗲");
    }
}
break;

case 'npm': {
await jean.sendMessage(from, { react: { text: "📦", key: m.key } });
    if (!text) return reply(`⚠️ 𝗨𝘀𝗮𝗴𝗲: ${command} <package>\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${command} 𝗮𝘅𝗶𝗼𝘀`)

    try {
        let res = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(text)}`)
        let data = res.data

        if (!data.name) return reply("❌ 𝗣𝗮𝗰𝗸𝗮𝗴𝗲 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.")

        // Get latest version
        let latestVersion = data['dist-tags']?.latest
        let info = data.versions[latestVersion]

        let npmInfo = `📦 *𝗡𝗣𝗠 𝗣𝗮𝗰𝗸𝗮𝗴𝗲 𝗜𝗻𝗳𝗼*\n
🔖 Name: ${data.name}
📌 Latest Version: ${latestVersion}
📝 Description: ${data.description || "N/A"}
👤 Author: ${info?.author?.name || "N/A"}
📅 Published: ${info?.date || "N/A"}
📦 License: ${info?.license || "N/A"}
🌐 Homepage: ${info?.homepage || "N/A"}
🔗 NPM: https://www.npmjs.com/package/${data.name}
`

        reply(npmInfo.trim())
    } catch (e) {
        console.error(e)
        reply("⚠️ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗡𝗣𝗠 𝗽𝗮𝗰𝗸𝗮𝗴𝗲 𝗶𝗻𝗳𝗼. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.")
    }
}
break;

case "groupinfo":
 case "gcinfo": {
 await jean.sendMessage(from, { react: { text: "📑", key: m.key } });
 
  if (!m.isGroup) return jean.sendMessage(m.chat, { text: "❌ *𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝘂𝘀𝗮𝗯𝗹𝗲 𝗼𝗻𝗹𝘆 𝗶𝗻 𝗮 𝗴𝗿𝗼𝘂𝗽.*" }, { quoted: m });
if (!owner) 
  return reply('❌ 𝗢𝗻𝗹𝘆 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗼𝘄𝗻𝗲𝗿 𝗼𝗿 𝘀𝘂𝗱𝗼 𝘂𝘀𝗲𝗿𝘀 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.');

  const groupInfo = await jean.groupMetadata(m.chat);
  const groupAdminsList = groupInfo.participants.filter(p => p.admin).map(p => p.id);

  let txt = `📊 *𝗚𝗿𝗼𝘂𝗽 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻*\n\n`;
  txt += `👥 *Name :* ${groupInfo.subject}\n`;
  txt += `🆔 *ID :* ${groupInfo.id}\n`;
  txt += `👑 *Creator :* @${groupInfo.owner.split("@")[0]}\n`;
  txt += `🧑‍🤝‍🧑 *Members :* ${groupInfo.participants.length}\n`;
  txt += `🛡️ *Admins :* ${groupAdminsList.length}\n`;
  txt += `🕒 *Created on :* ${new Date(groupInfo.creation * 1000).toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}`;

  await jean.sendMessage(m.chat, {
    text: txt,
     contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402881295184@newsletter',
                    newsletterName: '¿? JEAN STEPH TECH ¿?',
                    serverMessageId: 143
                }
            },
    mentions: [groupInfo.owner, ...groupAdminsList]
  }, { quoted: m });
}
break;
        
case "jid": case "idch": {
await jean.sendMessage(from, { react: { text: "🆔", key: m.key } });
if (!text) return reply("*𝗣𝘂𝘁 𝗹𝗶𝗻𝗸*")
if (!text.includes("https://whatsapp.com/channel/")) return m.reply("*𝗟𝗶𝗻𝗸 𝗜𝘀 𝗡𝗼𝘁 𝗙𝗼𝗿 𝗩𝗮𝗹𝗶𝗱 𝗖𝗵𝗮𝗻𝗻𝗲𝗹*")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await jean.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Name :* ${res.name}
* *Total followers :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "YES" : "NO"}
`
return reply(teks)
}
break

case 'deploy': {
await jean.sendMessage(from, { react: { text: "📂", key: m.key } });
const caption = `

╭━〔 𝗝𝗘𝗔𝗡-𝗦𝗧𝗘𝗣𝗛 𝗠𝗗-𝗫 〕━╮
┃
┃ 📦 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : JEAN STEPH MD-X
┃ ⚙️ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0.1
┃ 👑 𝗗𝗲𝘃 : 𝗝𝗘𝗔𝗡 𝗦𝗧𝗘𝗣𝗛 
┃
╰━━━━━━━━━━━━━━╯
╭━━━━〔 📥 𝗕𝗢𝗧 〕━━━╮ 
┃ 
┃ 🔗 𝗥𝗲𝗽𝗼 :
┃https://github.com/JeanStephTech/md-x/fork
┃
┃ 📂 𝗕𝗼𝘁 𝗙𝗶𝗹𝗲 :
┃
┃• 𝗢𝗕𝗜𝗧𝗢 𝗧𝗛𝗘𝗠𝗘 : 
┃https://files.lordobitotech.xyz/files/mdx-v1.0.1
┃
┃ 📂 𝗔𝗹𝗹 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 𝗙𝗶𝗹𝗲𝘀 :
┃ https://files.lordobitotech.xyz/files/groups/jsmdx
┃ 🌐 𝗪𝗲𝗯 𝗕𝗼𝘁 :
┃ https://js-mdx.lordobitotech.xyz (Offline at the moment )
┃ 🤖 𝗧𝗴 𝗯𝗼𝘁 :
┃ https://t.me/JS_MdX_Bot (offline at the moment)
┃
┃🧠 \`𝗗𝗘𝗣𝗟𝗢𝗬𝗠𝗘𝗡𝗧\`  
┃
┃ 📘 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹 :
┃
┃•Deploy on Termux : https://youtube.com/JeanStephTech
┃•Deploy on Ptero Server : https://youtube.com/JeanStephTech
┃
┃🚀 \`𝗙𝗥𝗘𝗘 𝗦𝗘𝗥𝗩𝗘𝗥𝗦\` 
┃
┃ 🌐 𝗪𝗲𝗯 : https://fps-web.lordobitotech.xyz
┃ 🤖 𝗧𝗴 𝗕𝗼𝘁 :
┃https://t.me/FreePanelsPterodactyl_Bot
┃
┃ Another free server : https://bothosting.net
┃
┃📡 \`𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟𝗦\`
┃
┃ 📢 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :
┃https://whatsapp.com/channel/0029VbCUG0XHltYAlmcp9A3T
┃ 💬 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 :
┃https://t.me/JeanStephTech
┃
┃🏢 \`𝗖𝗢𝗠𝗣𝗔𝗡𝗬\`
┃
┃ 🐙 𝗚𝗶𝘁𝗛𝘂𝗯 𝗢𝗿𝗴 :
┃ https://github.com/JeanStephTech
┃ 🌐 𝗢𝘂𝗿 𝘄𝗲𝗯𝘀𝗶𝘁𝗲 :
┃https://www.lordobitotech.xyz
┃
╰━━━━━━━━━━━━━━╯`;

await jean.sendMessage(m.chat, {
    image: { url: thumbnailUrl },
    caption: caption,
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363419984097704@newsletter",
            newsletterName: "¿? JEAN STEPH MD-X ¿?",
            serverMessageId: 143
        }
    }
}, { quoted: m });

}
break;

case "autotyping": {
await jean.sendMessage(from, { react: { text: "🖋️", key: m.key } });
    if (!isOwner) return reply("❌ Owner only");

    if (args[0] === "on") {
        global.db.settings.autotyping = true;
        reply("✅ Auto typing ON");
    } else if (args[0] === "off") {
        global.db.settings.autotyping = false;
        reply("❌ Auto typing OFF");
    }
}
break;

case "autorecord": {
await jean.sendMessage(from, { react: { text: "🎤", key: m.key } });

    if (!isOwner) return reply("❌ Owner only");

    if (args[0] === "on") {
        global.db.settings.autorecord = true;
        reply("✅ Auto record ON");
    } else if (args[0] === "off") {
        global.db.settings.autorecord = false;
        reply("❌ Auto record OFF");
    }
}
break;

case 'menu':
case 'jean':
case 'js': {
    await jean.sendMessage(from, { react: { text: "💫", key: m.key } });

    const JeanText = `╭━━━━━━━━━━━━━━━╮
┃  〔 𝗝𝗘𝗔𝗡 𝗦𝗧𝗘𝗣𝗛 𝗠𝗗-𝗫 〕
┝━━━━━━━━━━━━━━━┥
┃ 👤 𝗨𝗦𝗘𝗥 : @${sender.split("@")[0]}
┃ 💎 𝗩𝗘𝗥𝗦𝗜𝗢𝗡 : 𝟭.𝟬.𝟭
┃ 🛠️ 𝗗𝗘𝗩 : JEAN STEPH TECH
┃ 🎭 𝗧𝗛𝗘𝗠𝗘 : 𝗢𝗕𝗜𝗧𝗢 𝗨𝗖𝗛𝗜𝗛𝗔
┃ 📊 𝗖𝗠𝗗 : 38
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃   ⚙️〔 𝗨𝗧𝗜𝗟𝗦 〕
┝━━━━━━━━━━━━━━━┥
┃ ⏳ 𝗽𝗶𝗻𝗴        - speed bot
┃ 📜 𝗺𝗲𝗻𝘂        - show menu
┃ 🆔 𝗶𝗱𝗰𝗵        - id channel
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃  🎬〔 𝗠𝗘𝗗𝗜𝗔𝗦 〕
┝━━━━━━━━━━━━━━━┥
┃ 🖼️ 𝗶𝗺𝗴        - pinterest images
┃ 🎵 𝗽𝗹𝗮𝘆       - download music
┃ 📥 𝗳𝗯         - facebook dl
┃ 📥 𝘁𝗶𝗸𝘁𝗼𝗸     - tiktok dl
┃ 📥 𝗶𝗻𝘀𝘁𝗮      - instagram dl
┃ 😺 𝗰𝗮𝘁𝗯𝗼𝘅    - upload media
┃ 🔗 𝘂𝗿𝗹        - upload file
┃ 💾 𝘀𝗮𝘃𝗲      - save media/status
┃ 📌 𝗽𝗶𝗻       - pinterest dl
┃ 👤 𝗽𝗽        - get profile pic
┃ 👁 𝘃𝘃        - view once
┃ 🏷️ 𝘀𝘁𝗶𝗰𝗸𝗲𝗿   - make sticker
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃   📥〔 𝗗𝗘𝗩 𝗧𝗢𝗢𝗟𝗦 〕
┝━━━━━━━━━━━━━━━┥
┃ 📦 𝗻𝗽𝗺         - npm info
┃ 🦑 𝗴𝗶𝘁𝗵𝘂𝗯      - github stalk
┃ 🚀 𝗱𝗲𝗽𝗹𝗼𝘆      - bot deploy
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃  🤖〔 𝗔𝗨𝗧𝗢 〕
┝━━━━━━━━━━━━━━━┥
┃ 👁 𝗮𝘂𝘁𝗼𝘀𝘁𝗮𝘁𝘂𝘀 - view status
┃ ⌨️ 𝗮𝘂𝘁𝗼𝘁𝘆𝗽𝗶𝗻𝗴 - typing mode
┃ 🎤 𝗮𝘂𝘁𝗼𝗿𝗲𝗰𝗼𝗿𝗱 - recording mode
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃  👥〔 𝗚𝗥𝗢𝗨𝗣 〕
┝━━━━━━━━━━━━━━━┥
┃ 👻 𝗵𝗶𝗱𝗲𝘁𝗮𝗴     - hidden tag
┃ 📢 𝘁𝗮𝗴𝗮𝗹𝗹      - tag members
┃ 📛 𝗸𝗶𝗰𝗸        - remove member
┃ ❌ 𝗸𝗶𝗰𝗸𝗮𝗹𝗹     - empty group
┃ 🔊 𝘂𝗻𝗺𝘂𝘁𝗲      - open group
┃ 🔇 𝗺𝘂𝘁𝗲        - close group
┃ 📑 𝗴𝗰𝗶𝗻𝗳𝗼      - group info
┃ 👋 𝘄𝗲𝗹𝗰𝗼𝗺𝗲     - on/off
┃ 👑 𝗽𝗿𝗼𝗺𝗼𝘁𝗲   - add admin
┃ ❌ 𝗱𝗲𝗺𝗼𝘁𝗲    - remove admin
╰━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━╮
┃   🎊〔 𝗙𝗨𝗡 𝗠𝗘𝗡𝗨 〕
┝━━━━━━━━━━━━━━━┥
┃ 
╰━━━━━━━━━━━━━━━╯

> © 2026 - 𝗝𝗘𝗔𝗡 𝗦𝗧𝗘𝗣𝗛 𝗠𝗗-𝗫`;

    const videoUrl = "https://files.lordobitotech.xyz/mediafiles/a2c4bff2-b48b-4ec1-8c2f-6026b14dc789.mp4";
    const audioUrl = "https://files.lordobitotech.xyz/mediafiles/jean.mp3";

    // 🔥 BUFFER VIDEO (anti bug)
    const videoBuffer = (await axios.get(videoUrl, {
        responseType: 'arraybuffer'
    })).data;

    const sentMsg = await jean.sendMessage(
        m.chat,
        {
            video: Buffer.from(videoBuffer),
            caption: JeanText,
            gifPlayback: true,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419984097704@newsletter',
                    newsletterName: '¿? JEAN STEPH MD-X ¿?',
                    serverMessageId: 143
                }
            }
        },
        { quoted: m }
    );

    const audioBuffer = (await axios.get(audioUrl, {
        responseType: 'arraybuffer'
    })).data;

    await jean.sendMessage(
        m.chat,
        {
            audio: Buffer.from(audioBuffer),
            mimetype: 'audio/mpeg',
            ptt: false
        },
        { quoted: sentMsg }
    );

    break;
}
//============================
case 'tagall': {
await jean.sendMessage(from, { react: { text: "📢", key: m.key } });
    if (!m.isGroup) return reply('❌ Group only');

    let teks = `
╭━━━〔 👥 𝗧𝗔𝗚 𝗔𝗟𝗟 📢 〕━━━╮
┃ 
┃ *𝗧𝗮𝗴𝗮𝗹𝗹 𝗯𝘆 @${sender.split("@")[0]}*
┃
`;

    let mentions = [];
    let count = 1;

    for (let mem of participants) {
        let jid = mem.id;
        let name = store.contacts[jid]?.name 
            || mem.notify 
            || jid.split('@')[0];

        teks += `┃ ${count}. 👤 @${jid.split('@')[0]}\n`;

        mentions.push(jid);
        count++;
    }
    
    teks += `╰━━━━━━━━━━━━━━━━━╯`;

    let pp;
    try {
        pp = await jean.profilePictureUrl(m.sender, 'image');
    } catch {
        pp = 'https://files.lordobitotech.xyz/mediafiles/jean.jpg';
    }

    await jean.sendMessage(m.chat, {
        image: { url: pp },
        caption: teks,
        mentions,
        contextInfo: {
            mentionedJid: mentions,
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402881295184@newsletter',
                newsletterName: '¿? JEAN STEPH MD-X ¿?',
                serverMessageId: 143
            }
        }
    }, { quoted: m });
}
break;

case "kick": {
await jean.sendMessage(from, { react: { text: "🤡", key: m.key } });
if (!m.isGroup) return reply("❌ 𝗚𝗿𝗼𝘂𝗽 𝗢𝗻𝗹𝘆");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ 𝗢𝘄𝗻𝗲𝗿 𝗢𝗻𝗹𝘆" : "❌ 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆");
let users = participants.filter((u) => !areJidsSameUser(u.id, jean.user.id)); 
   let kickedUser = []; 
   for (let user of users) { 
     if (user.id.endsWith("@s.whatsapp.net") && !user.owner) { 
       await kickedUser.push(user.id); 
       await sleep(1 * 1000); 
     } 
   } 
   if (!kickedUser.length >= 1) 
     return reply("𝗜𝗻 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽 𝘁𝗵𝗲𝗿𝗲 𝗮𝗿𝗲 𝗻𝗼 𝗺𝗲𝗺𝗯𝗲𝗿𝘀 𝗲𝘅𝗰𝗲𝗽𝘁 𝘆𝗼𝘂 𝗮𝗻𝗱 𝗺𝗲"); 
   const res = await jean.groupParticipantsUpdate(m.chat, kickedUser, "remove"); 
   await sleep(3000); 
   await reply( 
     `𝘀𝘂𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗸𝗶𝗰𝗸𝗲𝗱 𝗺𝗲𝗺𝗯𝗲𝗿\n${kickedUser.map( 
       (v) => "@" + v.split("@")[0] 
     )}`, 
     null, 
     { 
       mentions: kickedUser, 
     } )
   }; 
break;

case "mute": {
await jean.sendMessage(from, { react: { text: "🔇", key: m.key } });
if (!m.isGroup) return reply("❌ 𝗚𝗿𝗼𝘂𝗽 𝗢𝗻𝗹𝘆");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ 𝗢𝘄𝗻𝗲𝗿 𝗢𝗻𝗹𝘆" : "❌ 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆");
await jean.groupSettingUpdate(m.chat, 'announcement')
reply("𝗦𝘂𝗰𝗰𝗲𝘀𝘀 𝗰𝗹𝗼𝘀𝗲𝗱 𝗴𝗿𝗼𝘂𝗽 𝗰𝗵𝗮𝘁,𝗮𝗹𝗹 𝗺𝗲𝗺𝗯𝗲𝗿𝘀 𝗮𝗿𝗲 𝗻𝗼𝘁 𝗮𝗹𝗹𝗼𝘄𝗲𝗱 𝘁𝗼 𝗰𝗵𝗮𝘁 𝗳𝗼𝗿 𝗻𝗼𝘄")
}
break
//==================================================//
case "unmute": {
await jean.sendMessage(from, { react: { text: "🔊", key: m.key } });
if (!m.isGroup) return reply("❌ 𝗚𝗿𝗼𝘂𝗽 𝗢𝗻𝗹𝘆");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ Ow*ner 𝗢𝗻𝗹𝘆" : "❌ 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆");
await jean.groupSettingUpdate(m.chat, 'not_announcement')
reply("𝗦𝘂𝗰𝗰𝗲𝘀𝘀 𝗼𝗽𝗲𝗻𝗲𝗱 𝗴𝗿𝗼𝘂𝗽 𝗰𝗵𝗮𝘁,𝗮𝗹𝗹 𝗺𝗲𝗺𝗯𝗲𝗿𝘀 𝗰𝗮𝗻 𝘀𝗲𝗻𝗱 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀 𝗶𝗻 𝗴𝗿𝗼𝘂𝗽 𝗻𝗼𝘄")
}
break

case "kickall": {
await jean.sendMessage(from, { react: { text: "👿", key: m.key } });
if (!m.isGroup) return reply("❌ 𝗚𝗿𝗼𝘂𝗽 𝗢𝗻𝗹𝘆");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ 𝗢𝘄𝗻𝗲𝗿 𝗢𝗻𝗹𝘆" : "❌ 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆");

    const botId = jean.decodeJid(jean.user.id);

    let raveni = participants
        .filter(v => v.id !== botId && v.admin === null) // ✅ skip bot + admins
        .map(v => v.id);

    reply("⚡ 𝗜𝗻𝗶𝘁𝗶𝗮𝗹𝗶𝘇𝗶𝗻𝗴 𝗞𝗶𝗰𝗸𝗮𝗹𝗹 𝗠𝗗-𝗫...");

    // 🔥 MESSAGE MD-X (inchangé)
    await jean.sendMessage(m.chat, {
        text: `╭━━━〔 💀 𝗞𝗜𝗖𝗞𝗔𝗟𝗟 〕━━╮
┃ ⚡ Status : Initializing...
┃ 👥 Members : ${raveni.length}
┃ 🚀 Mode : Destruction
╰━━━━━━━━━━━━━━━━╯

╭━━━〔 ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 〕━━╮
┃ This process is irreversible
┃ Removing all members...
╰━━━━━━━━━━━━━━╯`,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: MY_CHANNEL,
                newsletterName: '¿? JEAN STEPH MD-X ¿?',
                serverMessageId: 143
            }
        }
    }, { quoted: m });

    await sleep(1500);

    // 🔥 SUPPRESSION PROGRESSIVE (inchangé + fix sync)
    for (let user of raveni) {
        try {
            await jean.groupParticipantsUpdate(m.chat, [user], "remove");
            await sleep(800); // légèrement augmenté pour stabilité
        } catch (err) {
            console.log("Kick error:", err);
        }
    }

    // 🔥 attendre que WhatsApp finisse vraiment
    await sleep(2000);

    // ✅ FIN (inchangé)
    await jean.sendMessage(m.chat, {
        text: `
╭━━〔 ✅ 𝗗𝗢𝗡𝗘 〕━━╮
┃ All members removed
┃ 👋 Goodbye group
╰━━━━━━━━━━━╯`,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: MY_CHANNEL,
                newsletterName: '¿? JEAN STEPH MD-X ¿?',
                serverMessageId: 143
            }
        }
    }, { quoted: m });

    await sleep(2000);
}
break;
          
case 'welcome': {
    await jean.sendMessage(from, { react: { text: "🤗", key: m.key } });

    if (!m.isGroup) return reply("❌ 𝗚𝗿𝗼𝘂𝗽 𝗼𝗻𝗹𝘆");
    if (!isOwner) return reply("𝗢𝘄𝗻𝗲𝗿 𝗢𝗻𝗹𝘆 ❌")

    let group = getGroupSetting(m.chat);

     if (args[0] === 'on') {
        global.db.settings.welcome = true;
        reply("✅ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 & 𝗚𝗼𝗼𝗱𝗯𝘆𝗲 𝗲𝗻𝗮𝗯𝗹𝗲𝗱 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽");
    } else if (args[0] === 'off') {
        global.db.settings.welcome = false;
        reply("❌ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 & 𝗚𝗼𝗼𝗱𝗯𝘆𝗲 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽");
    } else {
        reply(`⚙️ 𝗦𝗧𝗔𝗧𝗨𝗦

👥 𝗪𝗲𝗹𝗰𝗼𝗺𝗲: ${global.db.settings.welcome ? "ON" : "OFF"}

Use:
.welcome on/off`);
    }
}
break;
case 'ping':
                          case 'p':
  await jean.sendMessage(from, { react: { text: '⌚', key: m.key } });
                            {
                              
                                   async function loading (jid) {
                             
                                    let start = new Date;
                                    let { key } = await jean.sendMessage(jid, {text: '𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗹𝗮𝘁𝗲𝗻𝗰𝘆.....'})
                                    let done = new Date - start;
                                    var lod = `*𝗣𝗼𝗻𝗴*:\n> ⏱️ ${done}ms (${Math.round(done / 100) / 10}s)`
                                    
                                    await sleep(1000)
                                    await jean.sendMessage(jid, {text: lod, edit: key });
                                    }
                                    loading(from)
                                   
                            }       
                            break;
   
                                                     
    // =========================
// 👑 PROMOTE / DEMOTE
// =========================
case "promote":
case "promot": {
    if (!m.isGroup) return reply("❌ 𝗚𝗿𝗼𝘂𝗽 𝗢𝗻𝗹𝘆");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ 𝗢𝘄𝗻𝗲𝗿 𝗢𝗻𝗹𝘆" : "❌ 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆");
for (let mem of participants) {
         let target = m.mentionedJid[0] 
        || (m.quoted ? m.quoted.sender : null) 
        || (text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null);

    if (!target) return reply("❌ 𝗧𝗮𝗴 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝗮 𝘂𝘀𝗲𝗿");

    try {
        await jean.groupParticipantsUpdate(m.chat, [target], "promote");

        reply(`👤 @${target.split("@")[0]} is now admin`);

    } catch (err) {
        reply("❌ Failed: " + err.message);
    }
}
break;

// =========================

case "demote":
case "dismiss": {
    if (!m.isGroup) return reply("❌ 𝗚𝗿𝗼𝘂𝗽 𝗢𝗻𝗹𝘆");
if (!(isOwner || isAdmins)) return reply(isOwner ? "❌ 𝗢𝘄𝗻𝗲𝗿 𝗢𝗻𝗹𝘆" : "❌ 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆");
    let target = m.mentionedJid[0] 
        || (m.quoted ? m.quoted.sender : null) 
        || (text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null);

    if (!target) return reply("❌ 𝗧𝗮𝗴 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝗮 𝘂𝘀𝗲𝗿");

    try {
        await jean.groupParticipantsUpdate(m.chat, [target], "demote");

        reply(`@${target.split("@")[0]} is no longer admin`);

    } catch (err) {
        reply("❌ Failed: " + err.message);
    }
}
break;


// =========================
// 👤 PROFILE PIC
// =========================
case "pp":
case "getpp":
case "profilepic": {
    await jean.sendMessage(m.chat, { react: { text: "👤", key: m.key } });

    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender);

    try {
        let pp = await jean.profilePictureUrl(target, "image");

        await jean.sendMessage(m.chat, {
            image: { url: pp },
            caption: `👤 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗼𝗳 @${target.split("@")[0]}`,
            mentions: [target]
        }, { quoted: m });

    } catch {
        reply("❌ 𝗡𝗼 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝘁𝘂𝗿𝗲");
    }
}
break;


// =========================
// 👁️ VIEW ONCE
// =========================
case "vv": {
    if (!m.quoted) return reply("❌ 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝘃𝗶𝗲𝘄 𝗼𝗻𝗰𝗲 𝗺𝗲𝗱𝗶𝗮");

    try {
        let msg = m.quoted.msg || m.quoted;

        let type = msg.mimetype.split("/")[0];

        const stream = await downloadContentFromMessage(msg, type);
        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (type === "image") {
            await jean.sendMessage(m.chat, {
                image: buffer,
                caption: "👁️ 𝗩𝗶𝗲𝘄𝗢𝗻𝗰𝗲 𝗜𝗺𝗮𝗴𝗲"
            }, { quoted: m });
        } else if (type === "video") {
            await jean.sendMessage(m.chat, {
                video: buffer,
                caption: "👁️ 𝗩𝗶𝗲𝘄𝗢𝗻𝗰𝗲 𝗩𝗶𝗱𝗲𝗼"
            }, { quoted: m });
        }

    } catch (e) {
        reply("❌ Failed to open view once");
    }
}
break;


// =========================
// 🧷 STICKER
// =========================
case "sticker":
case "s": {
    if (!m.quoted) return reply("❌ 𝗥𝗲𝗽𝗹𝘆 𝗶𝗺𝗮𝗴𝗲/𝘃𝗶𝗱𝗲𝗼");

    let mime = m.quoted.mimetype || "";

    if (/image/.test(mime)) {
        let media = await m.quoted.download();

        await jean.sendImageAsSticker(m.chat, media, m, {
            packname: global.packname,
            author: global.author
        });

    } else if (/video/.test(mime)) {
        if ((m.quoted.msg || m.quoted).seconds > 30)
            return reply("❌ 𝗠𝗮𝘅 30 𝘀𝗲𝗰");

        let media = await m.quoted.download();

        await jean.sendVideoAsSticker(m.chat, media, m, {
            packname: global.packname,
            author: global.author
        });

    } else {
        reply("❌ 𝗨𝗻𝘀𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱 𝗺𝗲𝗱𝗶𝗮");
    }
}
break;


// =========================
// 📌 PINTEREST DL
// =========================
case "pin":
case "pinterestdl": {
    if (!text) return reply("❌ 𝗚𝗶𝘃𝗲 𝗮 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁 𝗹𝗶𝗻𝗸");

    await jean.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        let res = await axios.get(`https://api.nekorinn.my.id/downloader/pinterest?url=${encodeURIComponent(text)}`);
        let data = res.data;

        if (!data.status) return reply("❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗹𝗶𝗻𝗸");

        let media = data.result.medias.find(v => v.extension === "mp4") 
                 || data.result.medias.find(v => v.extension === "jpg");

        if (!media) return reply("❌ 𝗡𝗼 𝗺𝗲𝗱𝗶𝗮 𝗳𝗼𝘂𝗻𝗱");

        let type = media.extension === "mp4" ? "video" : "image";

        await jean.sendMessage(m.chat, {
            [type]: { url: media.url },
            caption: `📌 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁 𝗗𝗟\n\n📎 ${text}`
        }, { quoted: m });

    } catch (e) {
        reply("❌ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗳𝗮𝗶𝗹𝗲𝗱");
    }
}
break;
                        
 case 'img': {
    await jean.sendMessage(m.chat, { react: { text: "🖼️", key: m.key } });

    if (!text) return reply("❌ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: .img Obito 5");

    let args = text.split(" ");
    let num = 3;

    let last = args[args.length - 1];
    if (!isNaN(last)) {
        num = Math.min(parseInt(last), 10);
        args.pop();
    }

    let query = args.join(" ");

    reply(`🔎 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 ${num} 𝗶𝗺𝗮𝗴𝗲𝘀 𝗳𝗼𝗿 "${query}"...`);

    try {
        let res = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
                q: query,
                cx: "d1a5b18a0be544a0e",
                searchType: "image",
                key: "AIzaSyDo09jHOJqL6boMeac-xmPHB-yD9dKOKGU",
                num: num
            }
        });

        let results = res.data.items;

        if (!results || results.length === 0) {
            return reply("❌ No images found");
        }

        for (let i = 0; i < results.length; i++) {
            try {
                let img = await axios.get(results[i].link, { responseType: "arraybuffer" });

                await jean.sendMessage(m.chat, {
                    image: Buffer.from(img.data),
                    caption: `╭━━〔 🖼 𝗜𝗠𝗔𝗚𝗘 ${i+1}/${results.length} 〕━━╮
┃ 🔍 Query : ${query}
┃ ⚡ Powered by MD-X
╰━━━━━━━━━━━━━━╯`,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: MY_CHANNEL,
                            newsletterName: '¿? JEAN STEPH MD-X ¿?',
                            serverMessageId: 143
                        }
                    }
                }, { quoted: m });

                await sleep(800);

            } catch (e) {
                console.log("Image error:", e.message);
            }
        }

        await jean.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.log(err);
        reply("❌ Error while fetching images");
    }
}
break;           
case 'song':
case 'play': {
    await jean.sendMessage(m.chat, { react: { text: "🎧", key: m.key } });

    try {
        const query = args.join(' ');
        if (!query) return reply("❌ Example : .song Alan Walker");

        const yts = require('yt-search');
        const search = await yts(query);

        if (!search.videos.length) return reply("❌ 𝗡𝗼 𝗿𝗲𝘀𝘂𝗹𝘁𝘀");

        const vid = search.videos[0];

        // preview style channel
        await jean.sendMessage(m.chat, {
            image: { url: vid.thumbnail },
            caption: `╭━━〔 🎵 𝗠𝗨𝗦𝗜𝗖 𝗙𝗢𝗨𝗡𝗗 〕━━━╮
┃ 🎧 *Title* : ${vid.title}
┃ ⏱️ *Duration* : ${vid.timestamp}
┃ 👁️ *Views* : ${vid.views}
┃ 🔗 *Link* : ${vid.url}
╰━━━━━━━━━━━━━━━━━╯

⏳ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗮𝘂𝗱𝗶𝗼...`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: MY_CHANNEL,
                    newsletterName: "¿? JEAN STEPH MD-X ¿?",
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

        await jean.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

        // API download
        let api = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(vid.url)}`;
        let { data } = await axios.get(api);

        if (!data?.status) return reply("❌ API error");

        await jean.sendMessage(m.chat, {
            audio: { url: data.audio },
            mimetype: "audio/mpeg",
            ptt: false,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: MY_CHANNEL,
                    newsletterName: "¿? JEAN STEPH MD-X ¿?",
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

        await jean.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.log(err);
        reply("❌ Download failed");
        await jean.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
}
break;
//=============≠≠==========
default:
}} catch (err) {
console.log('\x1b[1;31m'+err+'\x1b[0m')}}
