import fs from 'fs';
import Q from 'q';

export function fileConcat(promises, destination, cb) {
  Q.all(promises).then(values => fs.writeFile(destination, values.join(''), cb));
}

export function redisConcat(promises, destination, cb) {
  return undefined;
}
