const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const { exec } = require("child_process");

// 🔧 CONFIG
const REPO = "JeanStephTech/md-x";
const BRANCH = "main";
const BASE_API = `https://api.github.com/repos/${REPO}/contents`;
const BASE_RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;

// ⏱️ INTERVALS
const SCAN_INTERVAL = 60 * 1000;
const UPDATE_INTERVAL = 2 * 60 * 1000;

// 📦 IGNORE (IMPORTANT)
const IGNORE = [
    "node_modules",
    ".git",
    "database.json",
    "_sys.js"
];

// 🔐 HASH
function hash(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

// 📡 GET FILES FROM REPO
async function getRepoFiles(dir = "") {
    try {
        const res = await axios.get(`${BASE_API}/${dir}`);
        return res.data;
    } catch (e) {
        console.log("❌ GitHub API error:", e.message);
        return [];
    }
}

// 📥 DOWNLOAD FILE
async function downloadFile(filePath) {
    try {
        const url = `${BASE_RAW}/${filePath}`;
        const res = await axios.get(url, { responseType: "arraybuffer" });
        return Buffer.from(res.data);
    } catch (e) {
        console.log("❌ Download error:", filePath);
        return null;
    }
}

// 🔍 CHECK FILE
async function checkFile(filePath) {
    try {
        if (IGNORE.some(x => filePath.includes(x))) return;

        const localPath = path.join(__dirname, "..", filePath);

        // 🔒 si fichier inexistant → recréer
        if (!fs.existsSync(localPath)) {
            const remote = await downloadFile(filePath);
            if (remote) {
                fs.mkdirSync(path.dirname(localPath), { recursive: true });
                fs.writeFileSync(localPath, remote);
                console.log("📥 Restored missing:", filePath);
            }
            return;
        }

        const localData = fs.readFileSync(localPath);
        const localHash = hash(localData);

        const remoteData = await downloadFile(filePath);
        if (!remoteData) return;

        const remoteHash = hash(remoteData);

        if (localHash !== remoteHash) {
            console.log("⚠️ Modified:", filePath);

            fs.writeFileSync(localPath, remoteData);
            console.log("✅ Restored:", filePath);
        }

    } catch (e) {
        console.log("❌ Check error:", filePath);
    }
}

// 🔁 SCAN
async function scan(dir = "") {
    const files = await getRepoFiles(dir);

    for (let file of files) {
        if (!file || !file.path) continue;

        if (file.type === "file") {
            await checkFile(file.path);
        } else if (file.type === "dir") {
            await scan(file.path);
        }
    }
}

// 🔄 AUTO UPDATE (git pull)
function autoUpdate() {
    exec("git pull", (err, stdout) => {
        if (err) return;

        if (stdout && stdout.includes("Updating")) {
            console.log("🚀 Update detected, restarting...");
            process.exit(0); // PM2 relance
        }
    });
}

// 🚀 START
let started = false;

function startProtection() {
    // 🚫 Empêche multi lancement
    if (started) return;
    started = true;

    console.log("🔒 MD-X Protection ON");

    // scan immédiat
    scan();

    // scan continu
    setInterval(scan, SCAN_INTERVAL);

    // auto update
    setInterval(autoUpdate, UPDATE_INTERVAL);
}

// ❌ ANTI DELETE CORE
if (!fs.existsSync(__filename)) {
    console.log("❌ Core missing");
    process.exit(1);
}

module.exports = { startProtection };