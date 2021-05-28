module.exports =
{
    name: "help",
    usage: "",
    description: "Gives a short explanation of usage",
    execute(message, args)
    {
        const {commands} = message.client;

        let answer = "";
        answer += "`";
        if(!args.length)
        {
            answer += this.name + "`\n" + this.description + "\n";
            answer += "Available commands: ";
            commands.map(command => {
                if(!command.hidden)
                {
                    answer += "`" + command.name + "`, ";
                }
            });
            answer = answer.slice(0, answer.length - 2);
            answer += "\n";
        }
        else
        {
            if(commands.has(args[0]))
            {
                command = commands.get(args[0])
                answer += command.name;
                if(command.usage && command.usage != "")
                {
                    answer +=  " " + command.usage;
                }
                answer += "`\n" + command.description + "\n";
                if(command.example)
                {
                    answer += "Examples:"
                    command.example.forEach(example =>
                        {
                            answer += "\n`" + command.name  + " " + example.join("` => ");
                        });
                }
            }
            else
            {
                answer += args[0] + "` is not a valid command";
            }
        }
        message.channel.send(answer);
    },
};