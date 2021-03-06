var fs = require('fs');

//declare array to store messages
var messages = [];

var loadMessages = () => {
  //load messages from file if file exists
  fs.existsSync(__dirname + '/../messages.json') ? messages = JSON.parse(fs.readFileSync(__dirname + '/../messages.json')) : messages = [];
}

var storeMessage = message => {
  //create a uniquie objectId for message using milliseconds from Jan 1, 1970
  message.objectId = new Date().getTime();
  //create a timestamp for message using current timestamp
  message.createdAt = new Date(message.objectId).toJSON();
  message.updatedAt = message.createdAt;
  //improve compatability between clients and tests
  message.message ? message.text = message.message : message.message = message.text;
  //storeMessage stores the message that was passed in
  messages = [message, ...messages];
  //write all messages to storage file
  fs.writeFileSync(__dirname + '/../messages.json', JSON.stringify(messages));
  //return response object
  return JSON.stringify({
    objectId: message.objectId,
    createdAt: message.createdAt
  });
}; 

var returnMessages = () => {
  //returnMessages returns a stringified JSON object containing all messages
  return JSON.stringify({results: messages});
};

//export functions to be used by other modules
exports.loadMessages = loadMessages;
exports.storeMessage = storeMessage;
exports.returnMessages = returnMessages;