import { Telegraf } from "telegraf";
const TOKEN = "7317535877:AAGwALOCVKsjapHJ9E05_nCMKcXoHKJJg2w";
const bot = new Telegraf(TOKEN);
const web_link = "https://master--comprarlabot.netlify.app/";

bot.start((ctx) =>
  ctx.reply("Welcome to ComprarLa.", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "web app",
            web_app: { url: "https://http://23.227.167.112:3000/" },
          },
        ],
      ],
    },
  })
);
bot.launch();
