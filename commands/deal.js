module.exports =
{
    name: "deal",
    usage: "@User1 @User2 ...` \n_or_\n`deal <#CHANNEL_ID>",
    description: "Deals card to every mentioned user or every user in a channel",
    example:
        [
            ["@User1 @User2", "Deals cards to User1 and User 2"],
            ["<#CHANNEL_ID>", "Deals cards to every user in a channel"]
        ],
    execute(message, args)
    {
        // First: collect all mentioned people
        let mentions;
        //check if a channel was mentioned
        if(message.mentions.channels.size > 0)
        {
            // a channel was mentioned
            mentions = message.mentions.channels.first().members;
        }
        else
        {
            mentions = message.mentions.users;
        }
        console.debug(`${message.client.cards.length} cards left`);

        //remove the bot from the mentions
        mentions.delete(message.client.user.id);

        // Draw cards
        console.debug(`drawing ${mentions.size } cards...`);
        
        let answer = "";

        if(mentions.size > 0)
        {
            mentions.forEach(mention => {
                // Is this mention the bot itself?

                // When there are no cards left, reshuffle
                if (message.client.cards.length == 0) {
                    console.debug(`reshuffling cards`);
                    message.client.cards = message.client.cards.concat(message.client.discarded);
                    message.client.discarded.splice(0, message.client.discarded.length);
                    console.debug(`Discarded pile has now ${message.client.discarded.length} cards`);
                }

                //get random card
                let randomNumber = Math.floor(Math.random() * message.client.cards.length);
                let card = message.client.cards[randomNumber];
                //add to discarded pile
                message.client.discarded.push(card);
                message.client.cards = message.client.cards.filter(function(ele){ 
                    return ele != card; 
                });

                // Add card
                answer += `<@!${mention.id}> :${card.type}:`;
                if(card.value != 14)
                {
                    answer += ` ${ToEmoji(card.value)}`;
                }

                answer += `\n`;
            });

            message.channel.send(answer);
        }
        else {
            message.reply("You have to mention someone or a channel with someone in it");
        }
    },
};

function ToEmoji(value)
{
    if(value > 10)
    {
        let emoji = "";
        switch(value)
        {
            case 11:
                emoji = ":jack_o_lantern:";
                break;
            case 12:
                emoji = ":princess:";
                break;
            case 13:
                emoji = ":crown:";
                break;
            case 15:
                emoji = ":black_joker:";
                break;
        }
        return emoji;
    }
    return `:${ToWord(value / 10)}::${ToWord(value % 10)}:`;
}

function ToWord(number)
{
    number = Math.floor(number);

    let word = "";
    switch(number)
    {
        case 0:
            word = "zero";
            break;
        case 1:
            word = "one";
            break;
        case 2:
            word = "two";
            break;
        case 3:
            word = "three";
            break;
        case 4:
            word = "four";
            break;
        case 5:
            word = "five";
            break;
        case 6:
            word = "six";
            break;
        case 7:
            word = "seven";
            break;
        case 8:
            word = "eight";
            break;
        case 9:
            word = "nine";
            break;
    }
    return word;
}