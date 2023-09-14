/*CMD
  command: /checkJoining
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
CMD*/

if(!user){ return }

// if another user press button
if(String(user.id)!=params){
  let alertText = "This button is not for you 😜" 
  showAlert(alertText);
  return  // we stop execution here
}

function showAlert(text, show_alert){
  Api.answerCallbackQuery({
    text: text,
    callback_query_id: request.id,
    show_alert: show_alert // false - for alert on top
  })
}

function onCanCheck(time){
  // check joining without delay
  Libs.MembershipChecker.check();

  showAlert("Cheking your membership...");
  return true; // if false - cooldown is not restarted
}

function onWaiting(waitTime){
  let alertText = "Please wait: " + waitTime + " secs for next checking" + 
    "\n\nJoin our channels for full access now!";
  showAlert(
    alertText,
    true  // show alert on top
  );
}

// we use colldow lib
// because user can press button many times
// so we can restrict this
Libs.CooldownLib.user.watch({
  // you need name for cooldown
  name: "CheckJoiningCooldown",
  time: 15, // cooldown time in sec
  onStarting: onCanCheck,
  onEnding: onCanCheck,
  onWaiting: onWaiting
})
