// 24443 - lib id

let LIB_PREFIX = "MembershipChecker_";

function setupAdminPanel(){

  let panel = {
    // Panel title
    title: "Membership checker options",
    description: "use these options to check your user’s channel membership",
    icon: "person-add",

    fields: [
      {
        name: "chats",
        title: "Chats or channels for checking",
        description: "must be separated by commas",
        type: "string",
        placeholder: "@myChannel, @myChat",
        icon: "chatbubbles"
      },
      {
        name: "checkTime",
        title: "checking delay in minutes",
        description: "the bot will check the user membership for all incoming messages once at this time",
        type: "integer",
        placeholder: "10",
        value: 20,
        icon: "time"
      },
      {
        name: "onNeedJoining",
        title: "onNeedJoining command",
        description: "if the user does not have a membership, this command will be executed",
        type: "string",
        placeholder: "/onNeedJoining",
        icon: "alert"
      },
      {
        name: "onJoininig",
        title: "onJoininig command",
        description: "if the user just received a membership this command will be executed",
        type: "string",
        placeholder: "/onJoininig",
        icon: "happy"
      },
      {
        name: "onError",
        title: "onError command",
        description: "if an error occurs during verification, this command will be executed",
        type: "string",
        placeholder: "/onCheckingError",
        icon: "bug"
      },
      {
        name: "debug",
        title: "debug info",
        description: "turn on for debug info",
        type: "checkbox",
        value: false,
        icon: "hammer"
      }
    ]
  }

  AdminPanel.setPanel({
    panel_name: "MembershipChecker",
    data: panel
  });
}

function setup(){
  setupAdminPanel();
  Bot.sendMessage("MembershipChecker Panel: Setup - OK");
}

function getLibOptions(){
  return AdminPanel.getPanelValues("MembershipChecker");
}

function getUserData(){
  let data = User.getProperty(LIB_PREFIX + "Data");
  if(!data){ data = {} }
  return data;
}

function saveUserData(data){
  User.setProperty(LIB_PREFIX + "Data", data, "json");
}

function debugInfo(info){
  if(!getLibOptions().debug){ return }
  Api.sendMessage({
    text: "<b>MCL Debug:</b> " + 
    "\n  <b>message:</b> " + message +
    "\n\n⚡ " + info,
    parse_mode: "HTML"
  })
}

function msgIncludes(subStr){
  if(!subStr){ return false }
  if(subStr == ""){ return false }

  return message.includes(subStr)
}

function isInternalCommands(opts){
  if(!message){ return false }

  return (
    msgIncludes(LIB_PREFIX)||
    msgIncludes(opts.onJoininig)||
    msgIncludes(opts.onNeedJoining)||
    msgIncludes(opts.onError)
  )
}

function handle(){
  if(!user){ return }  // can check only for user

  let opts = getLibOptions();
  if(!opts.chats){
    throw new Error("MembershipChecker: please install chats for checking in Admin Panel");
  }

  // ignore internal commands
  if(isInternalCommands(opts)){
    debugInfo("ignore internal commands")
    return
  }

  if(completed_commands_count > 0){
    debugInfo("handle can not be run on sub commands")
    return
  }

  debugInfo("handle()")

  let lastCheckTime = getUserData().lastCheckTime;
  if(isFreshTime(lastCheckTime, opts)){
    // check is not needed now
    debugInfo("Checking is not required since the delay time has not come yet.\nCurrent delay: " + 
      String(opts.checkTime) + " min" )
    return
  }

  check();
}

function check(pass_options){
  let data = getUserData();
  // only 1 check per 2 second for one user
  if(data.sheduledAt){
    let duration = Date.now() - data.sheduledAt;
    if(duration < 2000){ return }
  }

  data.sheduledAt = Date.now();
  saveUserData(data)

  debugInfo("create task for checking")

  // create task for checking
  Bot.run({
    command: LIB_PREFIX + "checkMemberships",
    options: pass_options,   // pass options for run in background
    run_after: 1             // just for run in background
  })
}

function checkMembership(chat_id){
  if(!chat_id){
    chat_id = params;
  }

  Api.getChatMember({
    chat_id: chat_id,
    user_id: user.telegramid,
    on_result: LIB_PREFIX + "onCheckMembership " + chat_id,
    on_error: LIB_PREFIX + "onError " + chat_id,
    bb_options: options
  })
}

function getChats(){
  let options = getLibOptions();
  if(!options.chats){ return }
  return options.chats
}

function getNotJoinedChats(){
  return _getNotJoinedChats().join(", ")
}

function checkMemberships(){
  let chats = _getChats();
  debugInfo("run checking for " + JSON.stringify(chats));

  for(let ind in chats){
    // several chats
    let chat_id = chats[ind];
    Bot.run({
      command: LIB_PREFIX + "checkMembership " + chat_id,
      options: options,   // passed options
      run_after: 1,       // just for run in background
    })
  }
}

function isJoined(response){
  let status = response.result.status;
  return ["member", "administrator", "creator"].includes(status);
}

function handleMembership(chat_id, data){
  let opts = getLibOptions();

  if(!data[chat_id]&&opts.onJoininig){
    // run on just Joined
    Bot.run({
      command: opts.onJoininig,
      options: {
        chat_id: chat_id,
        result: options.result,
        bb_options: options.bb_options
      }
    })
  }

  data[chat_id] = Date.now();
  saveUserData(data);
}

function handleNoneMembership(chat_id, data){
  let opts = getLibOptions();

  data[chat_id] = false
  saveUserData(data);

  if(opts.onNeedJoining){
    Bot.run({
      command: opts.onNeedJoining,
      options: { 
        chat_id: chat_id,
        result: options.result,
        bb_options: options.bb_options
      } 
    })
  }
}

function onCheckMembership(){
  let chat_id = params;

  data = getUserData();
  data.lastCheckTime = Date.now();
  saveUserData(data);

  debugInfo("check response: " + JSON.stringify(options));

  if(isJoined(options)){
    debugInfo("user is joined to " + chat_id + " chat")
    return handleMembership(chat_id, data)
  }

  return handleNoneMembership(chat_id, data)
}

function onError(){
  debugInfo("onError for " + params + " >" + JSON.stringify(options))

  let opts = getLibOptions();
  if(!opts.onError){ return }  // no action
  opts.chat_id = params;
  Bot.run({ command: opts.onError, options: options })
}

function isFreshTime(curTime){
  if(!curTime){ return false }

  let options = getLibOptions();
  if(!options.checkTime){
    throw new Error("MembershipChecker: please install checking delay time in Admin Panel");
  }

  let duration = Date.now() - curTime; // in ms
  duration = duration / 1000 / 60; // in minutes

  return duration < parseInt(options.checkTime);
}

function isActualMembership(chat_id){
  if(!chat_id){ return false }

  let userData = getUserData()
  if(!userData[chat_id]){ return false }

  return isFreshTime(userData[chat_id])
}

function _getNotJoinedChats(){
  let result;
  let notJoined = [];
  let chats = _getChats();

  for(let ind in chats){
    result = isActualMembership(chats[ind]);
    if(!result){
      notJoined.push(chats[ind])
    }
  }
  return notJoined
}

function _getChats(needError){
  let options = getLibOptions();

  const error = "MembershipChecker: no chats for checking";
  if(!options.chats){ 
    if(needError){ throw new Error(error) }
  }

  let chats = options.chats.split(" ").join(""); // remove spaces
  chats = chats.split(",");

  if(!chats[0]){ throw new Error(error) }
  return chats
}

function _isChatsMember(){
  _getChats(true)  // with error if no chats
  return ( _getNotJoinedChats().length == 0 )
}

function isMember(chat_id){
  if(chat_id){
    return isActualMembership(chat_id);
  }

  // for all chats
  return _isChatsMember()
}

publish({
  setup: setup,                             // setup admin panel
  check: check,                             // manual checking without time delay
  handle: handle,                           // use on @ command - checking with time delay
  isMember: isMember,                       // check for all chats?
  getChats: getChats,                       // get all chats for checking
  getNotJoinedChats: getNotJoinedChats      // get not joined chats for this user
})

on(LIB_PREFIX + "checkMemberships", checkMemberships);
on(LIB_PREFIX + "checkMembership", checkMembership);
on(LIB_PREFIX + "onCheckMembership", onCheckMembership);
on(LIB_PREFIX + "onError", onError);
