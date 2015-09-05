import winston from 'winston';
winston.emitErrs = true;

/**
 * Basic logger configuration
 *
 * @type {exports.Logger|*}
 */
const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/transformer.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      prettyPrint: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});

export default logger;
