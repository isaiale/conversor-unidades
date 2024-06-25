const Alexa = require('ask-sdk-core');

const unitConversions = {
    "centímetros": { "pulgadas": 0.393701, "pies": 0.0328084 },
    "metros": { "yardas": 1.09361, "pies": 3.28084 },
    "kilómetros": { "millas": 0.621371 },
    "pulgadas": { "centímetros": 2.54, "metros": 0.0254 },
    "pies": { "centímetros": 30.48, "metros": 0.3048 },
    "millas": { "kilómetros": 1.60934 },
    "centimeters": { "inches": 0.393701, "feet": 0.0328084 },
    "meters": { "yards": 1.09361, "feet": 3.28084 },
    "kilometers": { "miles": 0.621371 },
    "inches": { "centimeters": 2.54, "meters": 0.0254 },
    "feet": { "centimeters": 30.48, "meters": 0.3048 },
    "miles": { "kilometers": 1.60934 }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const speakOutput = locale.startsWith('es')
            ? 'Bienvenido isai, que unidad quieres convertir. ¿Qué te gustaría intentar?'
            : 'Welcome isai, you can ask me to convert units. What would you like to try?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConvertUnitsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertUnitsIntent';
    },
    handle(handlerInput) {
        const { requestEnvelope, responseBuilder } = handlerInput;
        const fromUnit = Alexa.getSlotValue(requestEnvelope, 'fromUnit');
        const toUnit = Alexa.getSlotValue(requestEnvelope, 'toUnit');
        const value = parseFloat(Alexa.getSlotValue(requestEnvelope, 'value'));
        const locale = Alexa.getLocale(requestEnvelope);

        let conversionFactor;
        let speakOutput;

        if (locale.startsWith('es')) {
            // Conversiones en español
            if (unitConversions[fromUnit] && unitConversions[fromUnit][toUnit]) {
                conversionFactor = unitConversions[fromUnit][toUnit];
                const convertedValue = value * conversionFactor;
                speakOutput = `${value} ${fromUnit} son aproximadamente ${convertedValue.toFixed(2)} ${toUnit}`;
            } else {
                speakOutput = `Lo siento, no puedo convertir de ${fromUnit} a ${toUnit}. Por favor, intenta con otra unidad.`;
            }
        } else {
            // Conversiones en inglés
            if (unitConversions[fromUnit] && unitConversions[fromUnit][toUnit]) {
                conversionFactor = unitConversions[fromUnit][toUnit];
                const convertedValue = value * conversionFactor;
                speakOutput = `${value} ${fromUnit} are approximately ${convertedValue.toFixed(2)} ${toUnit}`;
            } else {
                speakOutput = `I'm sorry, I can't convert from ${fromUnit} to ${toUnit}. Please try with another unit.`;
            }
        }

        return responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const speakOutput = locale.startsWith('es')
            ? 'Puedes pedirme que convierta unidades del sistema métrico al sistema inglés y viceversa. ¿Cómo te puedo ayudar?'
            : 'You can ask me to convert units from the metric system to the imperial system and vice versa. How can I help you?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const speakOutput = locale.startsWith('es')
            ? '¡Adiós!'
            : 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertUnitsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler
    )
    .lambda();
