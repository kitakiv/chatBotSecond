import { Context, Markup, Telegraf } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

interface MyContext extends Context {
    myProp?: string
    myOtherProp?: number
  }

export default function makeNames(ctx: MyContext, group: string, res: { [key: string]: string | number}[], bot: Telegraf<MyContext>) {
    type CallbackButton = InlineKeyboardButton.CallbackButton;
    const buttons: CallbackButton[]= [];
    res.forEach((item) => {
        if (item.group === group) {
            const button = Markup.button.callback(item.name.toString(), `click_button:${item.name}`);
            buttons.push(button);
            bot.action(`click_button:${item.name}`, (ctx) => {
                if (item.name) {
                    ctx.reply(`${item.name} - ${item.ball}`);
                }
            })
        }

    })
    if (buttons && buttons.length > 0) {
        const newBtn = buttons.map((button) => {
            return [button]
        })
        const keyboard = Markup.inlineKeyboard(newBtn);
        ctx.reply('Choose your student:', keyboard);
      } else {
        ctx.reply('No students found');
      }
}