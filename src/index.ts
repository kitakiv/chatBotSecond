
import { message } from 'telegraf/filters';
import { Context, Telegraf } from 'telegraf';
import { FmtString } from 'telegraf/typings/format';
import readExcelFromURL from './readexcel';
import { InlineKeyboardButton, ReplyKeyboardRemove, KeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';
import makeNames from './names';
interface MyContext extends Context {
  myProp?: string
  myOtherProp?: number
}
const token = '7445498364:AAHRctZm3khsd_NPTos1-hsAEdVUQv86pcs';


const bot = new Telegraf<MyContext>(token);
bot.start((ctx) => {
  // const replyMarkup = Markup.removeKeyboard() as unknown as ReplyKeyboardRemove;
  // ctx.reply('Hello!', { reply_markup: replyMarkup });
// }
ctx.reply('Welcome');
})


bot.telegram.setMyCommands([
  { command: '/start', description: 'send welcome' },
  { command: '/help', description: 'help' },
  { command: '/myphoto', description: 'send your profile photo' },
  { command: '/all', description: 'send all your profile photos' },
  { command: '/myname', description: 'send your name' },
  { command: '/excel', description: 'choose your student' },
]);
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))


bot.command('myphoto', async (ctx) => {
  const userphoto =  (await bot.telegram.getUserProfilePhotos(ctx.from?.id));
  if (userphoto.total_count > 0) {
    ctx.replyWithPhoto(userphoto.photos[0][0].file_id);
  } else {
    ctx.sendSticker('https://i.pinimg.com/originals/be/4e/d6/be4ed6438b98db47659f5469cb026dd5.gif')
    ctx.reply('You haven\'t got a profile photo yet');
  }
});

bot.command('all', async (ctx) => {
  const userphoto =  (await bot.telegram.getUserProfilePhotos(ctx.from?.id));
  if (userphoto.total_count > 0) {
    userphoto.photos.forEach((photo) => {
      ctx.replyWithPhoto(photo[0].file_id);
    })
  } else {
    ctx.sendSticker('https://cdn.dribbble.com/users/1265589/screenshots/14304638/media/50ab30caf4e0fcdfb35fb95e840e2ae9.gif')
    ctx.reply('You haven\'t got profile photos yet');
  }
})

bot.command('myname', (ctx) => {
  ctx.reply(ctx.from?.first_name);
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
bot.use((ctx, next) => {
  ctx.myProp = ctx.chat?.type?.toUpperCase()
  return next()
})

bot.command('excel', async (ctx) => {
  const res = await readExcelFromURL("https://docs.google.com/spreadsheets/d/1uub6N22G0eq2Bo40f1JacXaVvds6DZ7TLTzpO06Jc3M/edit?usp=sharing");
  console.log(res)
  // const button = Markup.button.callback('Click Me', 'button_click');
  // const keyboard = Markup.inlineKeyboard([button]);

  // ctx.reply('Hello! Click the button below:', keyboard);
  // const buttons: Hideable<InlineKeyboardButton.CallbackButton>[] = [];
  type CallbackButton = KeyboardButton.CommonButton;
  const buttons: CallbackButton[] | undefined = res?.reduce((acc: CallbackButton[], item) => {
    if (item.group) {
      const group = item.group;
      if (acc.every((button) => button.text !== group)) {
        const button = Markup.button.callback(group, `click_button_group:${group}`);
        acc.push(button);



        bot.hears(`${group}`, (ctx) => {
            makeNames(ctx, group, res, bot)
        })



      }
    }
    return acc;
  }, []);

  if (buttons && buttons.length > 0) {
    console.log(buttons)
    const keyboard = Markup.keyboard(buttons).resize().oneTime();
    ctx.reply('Choose your group:', keyboard);
  } else {
    ctx.reply('No groups found');
  }

})



process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))