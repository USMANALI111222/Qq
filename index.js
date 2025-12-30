const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require("@adiwajshing/baileys");
const { state, saveState } = useSingleFileAuthState('./auth_info.json');
const figlet = require('figlet');
const chalk = require('chalk');
const readline = require('readline');

const adminModule = require('./modules/admin');
const messagesModule = require('./modules/messages');
const featuresModule = require('./modules/features');

// Typing effect title
console.log(chalk.red(figlet.textSync('PRO X USMAN', { horizontalLayout: 'full' })));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startBot() {
    const conn = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    conn.ev.on('creds.update', saveState);

    conn.ev.on('connection.update', (update) => {
        if(update.connection === 'close'){
            console.log(chalk.red('Connection closed. Restarting...'));
            startBot();
        } else if(update.connection === 'open'){
            console.log(chalk.green('✅ Connected!'));
        }
    });

    // Load WhatsApp features (500+)
    featuresModule.start(conn);

    // Termux menu
    const menu = `
1) Check All Messages
2) Promote Admin
3) Demote Admin
4) Kick Users
5) Ban Number
0) Exit
`;

    function termuxMenu() {
        console.log(menu);
        rl.question('Choose an option: ', async (opt) => {
            switch(opt) {
                case '1':
                    messagesModule.showAll(conn);
                    termuxMenu();
                    break;
                case '2':
                    rl.question('Enter number to promote: ', async (num) => {
                        await adminModule.promote(conn, 'YOUR_GROUP_JID_HERE', num);
                        termuxMenu();
                    });
                    break;
                case '3':
                    rl.question('Enter number to demote: ', async (num) => {
                        await adminModule.demote(conn, 'YOUR_GROUP_JID_HERE', num);
                        termuxMenu();
                    });
                    break;
                case '4':
                    rl.question('Enter number to kick: ', async (num) => {
                        await adminModule.kick(conn, 'YOUR_GROUP_JID_HERE', num);
                        termuxMenu();
                    });
                    break;
                case '5':
                    rl.question('Enter number to ban: ', async (num) => {
                        await adminModule.ban(conn, num);
                        termuxMenu();
                    });
                    break;
                case '0':
                    console.log(chalk.yellow('Exiting...'));
                    process.exit(0);
                default:
                    termuxMenu();
            }
        });
    }

    termuxMenu();
}

startBot();
