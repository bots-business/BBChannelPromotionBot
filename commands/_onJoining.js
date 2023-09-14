/*CMD
  command: /onJoining
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 

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

// grant access to BB chat now
grantAccess();

const userLink = Libs.commonLib.getLinkFor(user);

Bot.sendMessage(
  userLink + ",\n" +
  "Thank you for joining our channels." + 
  "\n\nYou can now write in this chat."
);

