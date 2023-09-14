/*CMD
  command: @
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
CMD*/

// ======== METHODS ==================

// grant or restrict user in current chat
// we need this for group chats restriction
function changeAccess(doGrant) {
  Api.restrictChatMember({
    user_id: user.telegramid,
    permissions: {
      can_send_messages: doGrant,
      can_send_media_messages: doGrant,
      can_send_polls: doGrant,
      can_send_other_messages: doGrant,
      can_add_web_page_previews: doGrant,
      can_send_audios: doGrant,
      can_send_documents: doGrant,
      can_send_photos: doGrant,
      can_send_videos: doGrant,
      can_send_video_notes: doGrant,
      can_send_voice_notes: doGrant,
      can_send_other_messages: doGrant
    }
  })
}

function grantAccess(){
  changeAccess(true)
}

function restrictAccess(){
  // only for group chats
  if(chat.chat_type=="private"){ return }

  changeAccess(false)
}

// ======== METHODS - END =============


// always check membership in background with delay
// You can change delay in Admin Panel
Libs.MembershipChecker.handle();

// you can restrict access to bot with:
/*
// for all chats and channels:
let isMember = Libs.MembershipChecker.isMember()

// for one chat / channel:
// let isMember = Libs.MembershipChecker.isMember("@chatName")

if(!isMember){
  let channels = Libs.MembershipChecker.getChats();
  Bot.sendMessage("Please join to our channels " + channels)
  return // return from execution - it is "@" command so bot will stop here 
}
*/

