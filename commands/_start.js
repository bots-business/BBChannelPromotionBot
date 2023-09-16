/*CMD
  command: /start
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
CMD*/

if(chat.chat_type != "private"){ return }

const text = "Hello!" +
"\n\nFor writing messages to chat @chatbotsbusiness you need subscribe to channel @botsbus." +
"\n\nPlease subscribe to @botsbus"

Bot.sendKeyboard("⚽ Check joining now", text);

