import fs from 'fs';
import async from 'async';

export function fileConcat(files, destination, cb) {

  async.waterfall([
    async.apply(read, files),
    async.apply(write, destination),
  ], cb);
}

function write(destination, buffers, cb) {
  fs.writeFile(destination, Buffer.concat(buffers), cb);
}

function read(files, cb) {
  async.mapSeries(files, readFile, cb);

  function readFile(file, cb) {
    fs.readFile(file, cb);
  }
}

export function redisConcat(files, destination, cb) {
  return;
}
