var get_conversation_id = [
    {
        label: "100ms",
        from: "Message Manager",
        to: "Identity",
        note: "get_system_id(this)",
        isDash: 0,
    },
    {
        label: "",
        from: "Identity",
        to: "api.ipify.org",
        note: "(I AM ANONYMOUS so...) get ip address",
        isDash: 0,
    },
    {
        label: "300ms",
        from: "Identity",
        to: "getConversationId.php",
        note: "get conversation ID from MySQL DB",
        isDash: 0,
    },
    {
        label: "400ms",
        from: "getConversationId.php",
        to: "MySQL Database",
        note: "create conversation ID if needed",
        isDash: 0,
    },
];

var send_message = [
    {
        label: "100ms",
        from: "Message Manager",
        to: "Firebase",
        note: "messageRef.push( msg )",
        isDash: 0,
    },
    {
        label: "",
        from: "Message Manager",
        to: "MySQL Database",
        note: "make api call to chatMessageInput.php ( msg )",
        isDash: 0,
    },
];

var genericCommand = [
    {
        label: "100ms",
        from: "genericCommand.vue",
        to: "App.vue",
        note: "emit sendCommand( commandObject )",
        isDash: 0,
    },
    {
        label: "",
        from: "App.vue",
        to: "server.js",
        note: "emit sendCommand( commandObject )",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "FileManager.js",
        note: "new FileManager()",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "ArrayPopulator.js",
        note: "new ArrayPopulator( fileManager, regexMapFile )",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "Regex.js",
        note: "new Regex( populator )",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "CommandExecutor.js",
        note: "new CommandExecutor( commandObject )",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "CommandExecutor.js",
        note: "executeCommand()",
        isDash: 0,
    },
    {
        label: "",
        from: "CommandExecutor.js",
        to: "server.js",
        note: "emit commandFinished( self.commandObject )",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "FileManager.js",
        note: "new FileManager()",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "ArrayPopulator.js",
        note: "new ArrayPopulator( Anonymous FileManager, regexFileName  )",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "Regex.js",
        note: "new Regex( populator )",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "OutputProcessor.js",
        note: "new OutputProcessor()",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "OutputProcessor.js",
        note: "processOutput( commandObject, regex )",
        isDash: 0,
    },
    {
        label: "",
        from: "server.js",
        to: "App.vue",
        note: "emit gotData( commandObject )",
        isDash: 0,
    },
];

var chatStartup = [
    {
        label: "100ms",
        from: "mcba_chat_main.js",
        to: "ConversationListManager.js",
        note: "new ConversationListManager()",
        isDash: 0,
    },
    {
        label: "",
        from: "mcba_chat_main.js",
        to: "MessageManager.js",
        note: "new MessageManager()",
        isDash: 0,
    },
    {
        label: "",
        from: "MessageManager.js",
        to: "Identity.js",
        note: "new Identiy()",
        isDash: 0,
    },
    {
        label: "",
        from: "Identity.js",
        to: "DataSource.js",
        note: "new DataSource()",
        isDash: 0,
    },
    // {
    //     label: "",
    //     from: "MessageManager.js",
    //     to: "Identity.js",
    //     note: "get_mcba_chat_system_id( this )",
    //     isDash: 0,
    // },
    {
        label: "",
        name: "Identity.js",
        note: "_popConversationId( messageManager )",
        isDash: 0,
    },
    {
        label: "",
        from: "Identity.js",
        to: "https://api.ipify.org/?format=json",
        note: "getMyIpAddress()",
        isDash: 0,
    },
    {
        label: "",
        from: "Identity.js",
        to: "getConversationId.php",
        note: "getConversationId( messageManager.ip )",
        isDash: 0,
    },
    {
        label: "",
        from: "Identity.js",
        to: "DataSource.js",
        note: "populateUserId( messageManager.conversation_id, identity )",
        isDash: 0,
    },
    {
        label: "",
        from: "DataSource.js",
        to: "getIdWithIpAddress.php.js",
        note: "populateUserId( identity.id )",
        isDash: 0,
    },
    {
        label: "",
        from: "mcba_chat_main.js",
        to: "ChatBox.js",
        note: "new ChatBox( ChatRouter chatRouter )",
        isDash: 0,
    },
    {
        label: "",
        from: "mcba_chat_main.js",
        to: "MessageManager.js",
        note: "setChatBox( ChatBox chatBox )",
        isDash: 0,
    },
];

var adminBrowserSetActiveConversation = [
    {
        label: "1ms",
        from: "Mouse Event",
        to: "MessageManager.js",
        note: "click() on conversation id",
        isDash: 0,
    },
    {
        label: "1ms",
        from: "MessageManager.js",
        to: "ChatBox.js",
        note: "clearScreen()",
        isDash: 0,
    },
    {
        label: "1ms",
        name: "MessageManager.js",
        note: "setActiveId()",
        isDash: 0,
    },
    {
        label: "1ms",
        from: "MessageManager.js",
        to: "ChatBox.js",
        note: "update( thisMessageManager )",
        isDash: 0,
    },
];

var adminBrowserSendToAnonymousGuest = [
    {
        label: "1ms",
        from: "Mouse Event",
        to: "MessageManager.js",
        note: "click() on conversation id",
        isDash: 0,
    },
];

var adminBrowserAnonymousGuestStartup = [
    {
        label: "",
        from: "mcba_chat_main.js",
        to: "ConversationListManager.js",
        note: "new ConversationListManager()",
        isDash: 0,
    },
    {
        label: "",
        from: "mcba_chat_main.js",
        to: "MessageManager.js",
        note: "new MessageManager()",
        isDash: 0,
    },
    {
        label: "",
        from: "MessageManager.js",
        to: "Identity.js",
        note: "new Identity()",
        isDash: 0,
    },
    {
        label: "",
        from: "mcba_chat_main.js",
        to: "ChatRouter.js",
        note: "new ChatRouter( listManager )",
        isDash: 0,
    },
    {
        label: "",
        from: "mcba_chat_main.js",
        to: "Chatbox.js",
        note: "new ChatBox( chatRouter )",
        isDash: 0,
    },

    {
        label: "",
        from: "mcba_chat_main.js",
        to: "MessageManager.js",
        note: "setChatBox( chatBox )",
        isDash: 0,
    },
    {
        label: "",
        from: "mcba_chat_main.js",
        to: "MessageManager.js",
        note: "updateMsgs( data, chatRouter )",
        isDash: 0,
    },
    {
        label: "",
        from: "MessageManager.js",
        to: "Message.js",
        note: "new Message( data )",
        isDash: 0,
    },
    {
        label: "",
        from: "MessageManager.js",
        to: "ChatRouter.js",
        note: "route( message, thisMessageManager )",
        isDash: 0,
    },
    {
        label: "",
        from: "ChatRouter.js",
        to: "Guest.js",
        note: "new Guest( message )",
        isDash: 0,
    },
    {
        label: "",
        from: "ChatRouter.js",
        to: "ConversationListManager.js",
        note: "addGuest( guest, chat_id )",
        isDash: 0,
    },
    {
        label: "",
        from: "MessageManager.js",
        to: "ChatBox.js",
        note: "update( thisMessageManager )",
        isDash: 0,
    },
];

var chatAnonymousBrowserStartup = [
    {
        label: "",
        from: "MessageManager.js",
        to: "Identity.js",
        note: "new Identity()",
        isDash: 0,
    },
    {
        label: "",
        from: "Identity.js",
        to: "DataSource.js",
        note: "new DataSource()",
        isDash: 0,
    },
    // {
    //     label: "",
    //     from: "MessageManager.js",
    //     to: "Identity.js",
    //     note: "get_mcba_chat_system_id( this )",
    //     isDash: 0,
    // },
    // {
    //     label: "",
    //     name: "Identity.js",
    //     note: "_popConversationId( messageManager )",
    //     isDash: 0,
    // },
    {
        label: "",
        from: "Identity.js",
        to: "https://api.ipify.org/?format=json",
        note: "getIpAddress()",
        isDash: 0,
    },
    {
        label: "",
        from: "Identity.js",
        to: "runQuery.php",
        note: "getMcbaUserId( identity )",
        isDash: 0,
    },
    {
        label: "",
        from: "Identity.js",
        to: "runQuery.php",
        note: "getConversationId( identity )",
        isDash: 0,
    }
];

var androidToAnonymousBrowser = [
    {
        label: "",
        from: "ChatActivity.java",
        to: "FirebaseAuth",
        note: "auth.getCurrentUser()",
        isDash: 0,
    },
    {
        label: "",
        from: "ChatActivity.java",
        to: "ConversationItem.java",
        note: "new ConversationItem()",
        isDash: 0,
    },
    {
        label: "",
        from: "ChatActivity.java",
        to: "Firebase",
        note: "push( conversationItem )",
        isDash: 0,
    },
    {
        label: "",
        from: "ChatActivity.java",
        to: "chatMessageInput.php",
        note: "send_messageToDevice( conversationItem )",
        isDash: 0,
    },
];

var chatMessageInputOperations = [
    {
        label: "",
        from: "chatMessageInput.php",
        to: "MCBAChatMessage.php",
        note: "new MCBAChatMessage()",
        isDash: 0,
    },
    {
        label: "",
        from: "MCBAChatMessage.php",
        to: "MySQL",
        note: "getAdminEmail()",
        isDash: 0,
    },
    {
        label: "",
        from: "MCBAChatMessage.php",
        to: "MySQL",
        note: "getUserEmailFromDatabase()",
        isDash: 0,
    },
    {
        label: "",
        from: "MCBAChatMessage.php",
        to: "MySQL",
        note: "getUserEmailFromConversationTable()",
        isDash: 0,
    },
    {
        label: "",
        from: "MCBAChatMessage.php",
        to: "MySQL",
        note: "getSenderIdFromDatabase()",
        isDash: 0,
    },
];

var run_query_monitor = [
  {
      label: "100ms",
      from: "Monitored Object Viewer",
      to: "Monitored Object",
      note: "setState()",
      isDash: 0,
  },
  {
      label: "",
      name: "Monitored Object",
      note: "notify()",
      isDash: 0,
  },
  {
      label: "",
      from: "Monitored Object",
      to: "Monitored Object Viewer",
      note: "update()",
      isDash: 0,
  },
  {
      label: "",
      from: "Monitored Object Viewer",
      to: "Monitored Object",
      note: "getState()",
      isDash: 0,
  }
];


