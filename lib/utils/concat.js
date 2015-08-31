import fs from 'fs';
import Q from 'q';

/**
 * Process all promises and write the output into the 'destination' file.
 *
 * @param {Array} promises
 * @param {string} destination
 * @param {Function} cb
 */
export function fileConcat(promises, destination, cb) {
  Q.all(promises).then(values => fs.writeFile(destination, values.join(''), cb));
}

/**
 * Process all promises and write the output into the 'destination' key of redis.
 *
 * @param {Array} promises
 * @param {string} destination
 * @param {Function} cb
 */
export function redisConcat(promises, destination, cb) {
  return undefined;
}
