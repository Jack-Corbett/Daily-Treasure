const Alexa = require('ask-sdk-core');
const PERMISSIONS = ['read::alexa:device:all:address'];

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
const OpenIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'OpenIntent';
  },
  handle(handlerInput) {
    var response;
    // INSERT LOGIC HERE
    
    return handlerInput.responseBuilder
      .speak(response)
      .withSimpleCard(skillName, response)
      .getResponse();
  }
};

const LockIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'LockIntent';
  },
  handle(handlerInput) {
    var response;
    var value = handlerInput.requestEnvelope.intent.slots.Treasure.value;
    console.log(value);
    // INSERT LOGIC HERE

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

// Tell the user local facts can't help with that
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

const messages = {
  WELCOME: 'Welcome to Daily Treasure!',
  HELP: 'You can say tell me a fact, or you can say exit.',
  HELP_REPROMPT: 'Ask me to tell you a fact.',
  FALLBACK: 'Local Facts can\'t help you with that. It can help you discover facts about your local area if you say: tell me a fact.',
  FALLBACK_REPROMPT: 'To learn a fact about your local area say: tell me a fact.',
  NOTIFY_MISSING_PERMISSIONS: 'Please enable address permissions in the Alexa app to find out facts about your local area. Then try again.',
  LOCATION_FAILURE: 'There was a problem fetching your address, please try again later.',
  ERROR: 'Sorry, an error occurred when fetching you a fact.',
  FACT_ERROR: 'I couldn\'t find any facts for your area. Make sure your device location is set in the Alexa app.',
  STOP: 'Thank you for using Local Facts!',
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();