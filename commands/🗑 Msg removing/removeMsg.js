/*CMD
  command: removeMsg
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 🗑 Msg removing
  answer: 
  keyboard: 
  aliases: 
CMD*/

if(!options){ return }

Api.deleteMessage({
  message_id: options.message_id
})
