/*CMD
  command: /onJoining
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 👣 Joining

  <<ANSWER

  ANSWER
  keyboard: 
  aliases: 
CMD*/

if(!options){
  // user can run this command manually
  // so we exit if there is no options
  // we always have options if this command is runned by lib
  return
}

// we check only one channel in this bot
// if you need several channels use this:
/*
Bot.sendMessage(
  "Thank you for joining to " + 
  options.chat_id
);

isMember = Libs.MembershipChecker.isMember();
let channels = Libs.MembershipChecker.getChats();

if(isMember){
 Bot.sendMessage("you joined to all channels and chats!"
}else{
 Bot.sendMessage("you need to join all channels and chats: " + channels)
}
*/

// grant access to BB chat now
grantAccess();

const userLink = Libs.commonLib.getLinkFor(user);
const text = userLink + ",\n" +
  "Thank you for joining our channels." + 
  "\n\nYou can now write in this chat." +
  "\n\n⏳ _This message will be deleted\nafter 3 minutes._"

Api.sendMessage({
  text: text,
  parse_mode: "Markdown",
  on_result: "removeMsgAfter 3"
})
