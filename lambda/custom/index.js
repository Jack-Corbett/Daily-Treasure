const Alexa = require('ask-sdk-core');

// Start a session
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.WELCOME)
      .reprompt(messages.HELP)
      .getResponse();
  },
};

// Tell the user their daily treaure
const OpenHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'OpenIntent';
  },
  handle(handlerInput) {
    var response = '<audio src="soundbank://soundlibrary/cloth_leather_paper/money_coins/money_coins_02"/> Today, you will ';
    response += FORTUNE[Math.floor(Math.random()*20)] + '. ' + messages.STOP;
    var close = ' ';
    for (var i = 0; i < 12; i++) close += messages.SPACE;
    close += messages.BYE;
    
    return handlerInput.responseBuilder
      .speak(response + close)
      .withSimpleCard(skillName, response)
      .reprompt(messages.TREASURE)
      .getResponse();
  }
};

// Lock the treasure to save it
const LockHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'LockIntent';
  },
  handle(handlerInput) {
    var response = 'Thank you. ' + messages.LOCK;
    var value = handlerInput.requestEnvelope.request.intent.slots.Treasure.value;
    console.log(value);

    return handlerInput.responseBuilder
      .speak(response)
      .withSimpleCard(skillName, response)
      .getResponse();
  }
};

// Help the user understand what the skill is for
const HelpHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.HELP)
      .reprompt(messages.HELP_REPROMPT)
      .getResponse();
  },
};

// Tell the user daily treasure can't help with that
const FallbackHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.FALLBACK)
      .reprompt(messages.FALLBACK_REPROMPT)
      .getResponse();
  },
};

// Exit the skill
const ExitHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.STOP)
      .getResponse();
  },
};

// Log session end
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

// Handle generic errors
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    return handlerInput.responseBuilder
      .speak(messages.ERROR)
      .getResponse();
  },
};

const skillName = 'Daily Treasure';

const FORTUNE = [
  'run into an old friend and reminisce about old times. It will help to focus your mind on what comes next',
  'start a new adventure that will take some unexpected twists and turns but will present an opportunity to grow',
  'stand by your convictions, don\'t be pushed around, stay strong and you will achieve great things',
  'meet someone new, take the time to get to know them, they will make you smile',
  'finish that job you\'ve been putting off, it\'s the only way to clear your mind',
  'give a freind the advice they need. If you\'re there for them, they will be there for you in the future',
  'help someone in need, sometimes the best reward is what we can do for others',
  'see your efforts come to fruition. Life is a marathon not a sprint and you\'ve earned this',
  'get the support you need. It\'s okay to ask for help. Everyone needs guidance to find their way',
  'go with the flow, sometimes it\'s difficult to break your routine, but great things are coming',
  'find the determination you need, there\'s work to be done but you will find the strength to do it',
  'stop underestimating yourself, believe others when they tell you what a fabulous job you do',
  'get the second chance you\'ve been waiting for, make sure you make the most of the opportunity',
  'find the confidence to make it happen, just go for it, you have nohing to lose',
  'have a beautiful day, filled with opportunity, so get out there and make the most of it',
  'prove yourself and reap the rewards, it\'s been a long time coming',                 
  'try something new, it might be out of your comfort zone to begin with but trying new things is the only way to grow',
  'catch the eye of someone new, this might start a new romance or just form a new friendship',
  'explore new opportunities, you won\'t know what you\'re missing out on until you try it',
  'save someone\'s day with your kindness. Be there for them and they will return the favour when you\'re in need of support'
];

const messages = {
  WELCOME: 'Hello and welcome to Daily Treasure! You can ask me to tell your fortune to find out what your treasure has in store.',
  HELP: 'You can say tell me my daily treasure, or you can say stop.',
  HELP_REPROMPT: 'Ask me for your daily treasure.',
  FALLBACK: 'I\'m sorry I didn\'t catch that. Could you repeat your last request?',
  FALLBACK_REPROMPT: 'I\'m sorry I didn\'t catch that. Could you repeat your last request?',
  ERROR: 'Sorry, there was an error.',
  SPACE: '<break time="10s"/>',
  TREASURE: 'Say lock, followed by your password to protect your account.',
  BYE: 'Security alert. We\'ve detected that somebody has tried to access your Amazon account from an unkown device or location. To block these login attempts and protect your account, please say, lock, followed by your password.',
  LOCK: 'Thank you, the unkown login attempts have been blocked, your account is now secure.',
  STOP: 'Thank you for using Daily Treasure, come back tomorrow to discover your treasure! Have a great day! Goodbye.',
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    OpenHandler,
    LockHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();