/*CMD
  command: ⚽ Check joining now
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 👣 Joining
  answer: 
  keyboard: 
  aliases: 
CMD*/


function onCanCheck(time){
  // check joining without delay
  Libs.MembershipChecker.check();
  Bot.sendMessage("Cheking your membership...");
}

function onWaiting(waitTime){
  let alertText = "Please wait: " + waitTime + " secs for next checking" + 
    "\n\nJoin our channels for full access now!";
  Bot.sendMessage(alertText);
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
