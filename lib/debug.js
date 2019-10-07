const __DEBUG__ = process.env.NODE_DEBUG_LOGGING;

const debug = (...msg) => {
  if (__DEBUG__){
    console.log(...msg);
  }
};

module.exports = { debug };
