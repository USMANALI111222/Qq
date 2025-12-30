const chalk = require('chalk');

module.exports = {
    async promote(conn, groupJid, number){
        try{
            await conn.groupMakeAdmin(groupJid, [number + '@s.whatsapp.net']);
            console.log(chalk.green('✅ Admin promoted:', number));
            await conn.sendMessage(groupJid, '✅ ' + number + ' promoted by bot');
        }catch(e){console.log(chalk.red('❌ Promote failed:', e.message));}
    },
    async demote(conn, groupJid, number){
        try{
            await conn.groupDemoteAdmin(groupJid, [number + '@s.whatsapp.net']);
            console.log(chalk.yellow('⚠ Admin demoted:', number));
            await conn.sendMessage(groupJid, '⚠ ' + number + ' demoted by bot');
        }catch(e){console.log(chalk.red('❌ Demote failed:', e.message));}
    },
    async kick(conn, groupJid, number){
        try{
            await conn.groupRemove(groupJid, [number + '@s.whatsapp.net']);
            console.log(chalk.red('❌ User kicked:', number));
            await conn.sendMessage(groupJid, '❌ ' + number + ' kicked by bot');
        }catch(e){console.log(chalk.red('❌ Kick failed:', e.message));}
    },
    async ban(conn, number){
        console.log(chalk.cyan('⚠ Mass action started on number:', number));
        // Legal action: just log
    }
};
