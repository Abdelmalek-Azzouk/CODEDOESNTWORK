require('dotenv/config');
const { Client } =  require('discord.js');
const { OpenAI } =  require('openai');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () =>{
    console.log('this bot is online');
});

const IGNORE_PREFIX = "!";
const CHANNELS = ['853357809180344341'];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
})

client.on('messageCreate', async (message) =>{
    if (message.author.bot) return;
    if (message.content.startsWith(IGNORE_PREFIX)) return;
    if(!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id) ) return; 

    const response = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    //name: 
                    role: 'system',
                    content: 'Do you require something? If not, I will wait.',
                },
                {
                     //name: 
                     role: 'user',
                     content: message.content,
                }, 
            ],
         })
         .catch((error) => console.error('OpenAI error \n', error));
    
    message.reply(response.choices[0].message.content);

});

client.login(process.env.TOKEN);