const { createLogger, transports } = require('winston');

const logger = createLogger({
  transports: [
    new transports.File({ filename: 'file.log' }),
  ],
});

const info = (message) => {
  logger.info(message);
}

const error = (message) => {
  logger.error(message);
}

exports.info = info;
exports.error = error;