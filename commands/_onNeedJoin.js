/*CMD
  command: /onNeedJoin
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER
  keyboard: 
  aliases: 
CMD*/

// you can run this command for checking manually with:
// /onNeedJoin

restrictAccess();

// send need join message and inline keyboard with one button
const channels = Libs.MembershipChecker.getNotJoinedChats();
const userLink = Libs.commonLib.getLinkFor(user);

let alertText = "Dear " + userLink + "," +
  "\n🎃 You are now prohibited from writing." +
  "\n\n Please *join our channels* for full access: " + channels

Api.sendMessage({
  text: alertText,
  reply_markup: { inline_keyboard: [
    [
      { text: "Joined", callback_data: "/checkJoining " + user.id }
    ]
  ]},
  parse_mode: "Markdown"
})


