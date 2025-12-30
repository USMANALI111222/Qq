#!/usr/bin/env node

const { WAConnection } = require('baileys');
const chalk = require('chalk');
const figlet = require('figlet');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Modules
const admin = require('./modules/admin');
const messages = require('./modules/messages');
const features = require('./modules/features'); // 500+ MD bot features
const utils = require('./modules/utils');

let conn = new WAConnection();

// ---------- UTILS ----------
function ask(q){ return new Promise(res => rl.question(q, ans => res(ans.trim()))) }

// ---------- TERMUX MENU ----------
async function mainMenu(){
    console.log(chalk.cyan(`
============================
1) Check All Messages
2) Promote Admin
3) Demote Admin
4) Kick Users
5) Ban Number
0) Exit
============================
`));
    const choice = await ask("> ");
    const groups = conn.chats.array.filter(c => c.jid.includes('@g.us'));

    if(choice==="1"){ messages.showAll(conn); }
    if(choice==="2"){ 
        const g = await ask("Select group number: ");
        const number = await ask("Enter number: ");
        await admin.promote(conn, groups[g-1].jid, number);
    }
    if(choice==="3"){
        const g = await ask("Select group number: ");
        const number = await ask("Enter number: ");
        await admin.demote(conn, groups[g-1].jid, number);
    }
    if(choice==="4"){
        const g = await ask("Select group number: ");
        const number = await ask("Enter number: ");
        await admin.kick(conn, groups[g-1].jid, number);
    }
    if(choice==="5"){
        const number = await ask("Enter number to ban: ");
        await admin.ban(conn, number);
    }
    if(choice==="0"){ process.exit(0); }

    mainMenu();
}

// ---------- START BOT ----------
async function startBot(){
    console.log(chalk.redBright(figlet.textSync("PRO X USMAN")));

    conn.on('qr', qr=>{
        console.log(chalk.yellow("\nPAIRING CODE:"));
        console.log(qr);
    });

    conn.on('open', async ()=>{
        console.log(chalk.green("\n✅ CONNECTED TO WHATSAPP"));
        await utils.autoInfo(conn);
        features.start(conn); // 500+ MD bot features run on WhatsApp
        mainMenu(); // Termux menu
    });

    await conn.connect({timeoutMs:30*1000});
}

startBot();