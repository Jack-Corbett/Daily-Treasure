const Alexa = require('ask-sdk-core');
const message = require('./message');

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
    var response = 'Today, you will ';
    response += FORTUNE[Math.floor(Math.random()*20)] + '. ' + message.STOP;
    var close = ' ';
    for (var i = 0; i < 20; i++) close += message.SPACE;
    close += message.BYE;
    
    return handlerInput.responseBuilder
      .speak(response + close)
      .withSimpleCard(skillName, response)
      .reprompt(message.TREASURE)
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
    var response = 'Thank you. ' + message.LOCK;
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
  'run into an old friend',
  'start a new adventure',
  'stand by your convictions, don\'t be pushed around',
  'meet someone new, who will make you smile',
  'finish that job you\'ve been putting off',
  'give a freind the advice they need',
  'help someone in need',
  'see your efforts come to fruition',
  'get the support you need',
  'go with the flow, as great things are coming',
  'find the determination you need',
  'stop underestimating yourself',
  'get the second chance you\'ve been waiting for',
  'find the confidence to make it happen',
  'have a beautiful day',
  'prove yourself',
  'try something new',
  'catch the eye of someone new',
  'explore new opportunities',
  'save someone\'s day with your kindness'
];

const messages = {
  WELCOME: 'Welcome to Daily Treasure!',
  HELP: 'You can say tell me my daily treasure, or you can say exit.',
  HELP_REPROMPT: 'Ask me for your daily treasure.',
  FALLBACK: 'Daily Treasure can\'t help you with that. It can tell you your daily fortune by saying: tell me my treasure.',
  FALLBACK_REPROMPT: 'To find out your daily fortune say: tell me my treasure.',
  ERROR: 'Sorry, I couldn\'t fetch your fortune.',
  STOP: 'Have a great day! Goodbye.',
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