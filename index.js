require('dotenv').config();

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

// Preface
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

// Card functions

client.cards = new Array();
client.discarded = new Array();

for(const type of ["clubs", "spades", "hearts", "diamonds"]) {
    for(let i = 2; i <= 14; i++)
    {
        client.cards.push({type: type, value: i});
    }
}

client.cards.push({type: "black_circle", value: 15});
client.cards.push({type: "red_circle", value: 15});

//client methods
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
    const mention = args.shift();

    if (message.mentions.has(client.user.id) && mention === `<@!${client.user.id}>`) {
        const command = args.shift().toLowerCase();

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