require('dotenv').config();

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} with ${client.user.id}!`);
});

client.on('message', message => {
    if (message.author.bot) {
        return false;
    }

    if (message.content.includes("@here") || message.content.includes("@everyone")) {
        return false;
    }

    const args = message.content.split(/ +/);
    console.debug(args);
    const mention = args.shift();
    const command = args.shift().toLowerCase();

    if (message.mentions.has(client.user.id) && mention === `<@!${client.user.id}>`) {
        if (!client.commands.has(command)) {
            return;
        }

        try
        {
            client.commands.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    };
});



client.login(process.env.DISCORD_TOKEN);