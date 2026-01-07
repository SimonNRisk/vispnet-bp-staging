// Before Conversation Logic - Execute Card
// This code runs at the start of a conversation

console.log('[DEBUG] ===== Execute Card Start =====');
console.log('[DEBUG] Event object:', JSON.stringify({
  userId: event.userId,
  conversationId: event.conversationId,
  type: event.type
}, null, 2));

console.log('[DEBUG] Event state:', JSON.stringify({
  session: event.state.session,
  conversation: event.state.conversation,
  bot: event.state.bot,
  stacktrace: event.state.__stacktrace
}, null, 2));

// Check if this is the start of a conversation
const isConversationStart = !event.state.session?.history?.some(m => m.sender === 'bot') ||
                           event.state.__stacktrace?.[0]?.node === 'node:Start';

console.log('[DEBUG] isConversationStart:', isConversationStart);

if (!isConversationStart) {
  console.log('[DEBUG] Not conversation start, exiting early');
  return;
}

console.log('[DEBUG] This is conversation start, proceeding...');

// Initialize input state
const input = {
  state: {
    conversation: event.state.conversation || {},
    bot: event.state.bot || {}
  }
};

console.log('[DEBUG] Input state initialized:', JSON.stringify(input, null, 2));

// Get user data function
const getUserOutput = async () => {
  console.log('[DEBUG] ===== getUserOutput Start =====');

  const userId = event.userId;
  const conversationId = event.conversationId;

  console.log('[DEBUG] userId:', userId);
  console.log('[DEBUG] conversationId:', conversationId);

  console.log('[DEBUG] Calling webchat:getUserData action...');

  try {
    const userData = await client.callAction({
      type: 'webchat:getUserData',
      input: {
        userId
      }
    });

    console.log('[DEBUG] ===== Raw userData Response =====');
    console.log('[DEBUG] Full userData object:', JSON.stringify(userData, null, 2));
    console.log('[DEBUG] userData keys:', Object.keys(userData || {}));

    if (userData.output) {
      console.log('[DEBUG] userData.output keys:', Object.keys(userData.output || {}));
      console.log('[DEBUG] userData.output:', JSON.stringify(userData.output, null, 2));

      if (userData.output.userData) {
        console.log('[DEBUG] userData.output.userData exists');
        console.log('[DEBUG] userData.output.userData:', JSON.stringify(userData.output.userData, null, 2));
      } else {
        console.log('[DEBUG] WARNING: userData.output.userData is undefined!');
        console.log('[DEBUG] Available properties:', Object.keys(userData.output));
      }
    } else {
      console.log('[DEBUG] WARNING: userData.output is undefined!');
    }

    // Try to extract username and password with safety checks
    let username, password;

    if (userData.output?.userData?.username) {
      username = userData.output.userData.username;
      password = userData.output.userData.password;
      console.log('[DEBUG] Found credentials at userData.output.userData');
    } else if (userData.output?.username) {
      username = userData.output.username;
      password = userData.output.password;
      console.log('[DEBUG] Found credentials at userData.output');
    } else if (userData.userData?.username) {
      username = userData.userData.username;
      password = userData.userData.password;
      console.log('[DEBUG] Found credentials at userData.userData');
    } else {
      console.log('[DEBUG] ERROR: Could not find username/password in userData structure');
      console.log('[DEBUG] Searched paths:');
      console.log('[DEBUG]   - userData.output.userData.username');
      console.log('[DEBUG]   - userData.output.username');
      console.log('[DEBUG]   - userData.userData.username');
    }

    console.log('[DEBUG] Extracted username:', username);
    console.log('[DEBUG] Extracted password:', password ? '[REDACTED]' : undefined);

    if (!username || !password) {
      console.log('[DEBUG] ERROR: Username or password is missing, cannot authenticate');
      return {
        state: {
          conversation: {
            ...input.state.conversation,
            authFailed: true,
            authError: 'Missing username or password',
            conversationId,
            userId
          }
        }
      };
    }

    let authFailed = false;

    console.log('[DEBUG] Making authentication request to https://data.visp.net/authenticate');

    try {
      const response = await axios.post('https://data.visp.net/authenticate', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Visp-Agent': 'ubo-web'
        },
        timeout: 5000
      });

      console.log('[DEBUG] Auth response status:', response.status);
      console.log('[DEBUG] Auth response data:', JSON.stringify(response.data, null, 2));

      if (response.status !== 200) {
        console.log(`[DEBUG] Auth failed with status: ${response.status}`);
        authFailed = true;
      } else {
        console.log(`[DEBUG] Auth succeeded!`);
      }
    } catch (error) {
      console.log(`[DEBUG] Auth request failed with error: ${error.message}`);
      console.log('[DEBUG] Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      authFailed = true;
    }

    console.log('[DEBUG] Final authFailed status:', authFailed);

    const result = {
      state: {
        conversation: {
          ...input.state.conversation,
          authFailed,
          conversationId,
          userId
        }
      }
    };

    console.log('[DEBUG] Returning result:', JSON.stringify(result, null, 2));

    return result;

  } catch (error) {
    console.log('[DEBUG] ERROR in getUserOutput:', error.message);
    console.log('[DEBUG] Error stack:', error.stack);
    throw error;
  }
};

console.log('[DEBUG] Executing getUserOutput...');
const result = await getUserOutput();

console.log('[DEBUG] getUserOutput completed');
console.log('[DEBUG] Result:', JSON.stringify(result, null, 2));

if (result?.state?.conversation) {
  console.log('[DEBUG] Updating event.state.conversation');
  if (!event.state.conversation) {
    event.state.conversation = {};
  }
  Object.assign(event.state.conversation, result.state.conversation);
  console.log('[DEBUG] Updated event.state.conversation:', JSON.stringify(event.state.conversation, null, 2));
}

if (result?.state?.bot) {
  console.log('[DEBUG] Updating event.state.bot');
  if (!event.state.bot) {
    event.state.bot = {};
  }
  Object.assign(event.state.bot, result.state.bot);
  console.log('[DEBUG] Updated event.state.bot:', JSON.stringify(event.state.bot, null, 2));
}

console.log('[DEBUG] ===== Execute Card End =====');
