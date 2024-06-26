import { Context, Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

interface MyContext extends Context {
  myProp?: string
  myOtherProp?: number
}
const token = '7445498364:AAHRctZm3khsd_NPTos1-hsAEdVUQv86pcs'
console.log(token)

const bot = new Telegraf<MyContext>(token)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
bot.use((ctx, next) => {
  ctx.myProp = ctx.chat?.type?.toUpperCase()
  return next()
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))