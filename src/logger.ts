import winston from 'winston';

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),    
        winston.format.simple(),
    ),
    level: 'debug',
    transports: [
        new winston.transports.Console()
    ]
});