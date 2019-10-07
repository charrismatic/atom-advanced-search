const __DEBUG__ = process.env.NODE_DEBUG_LOGGING ? true : false;

const debug = (...msg) => {
  if (__DEBUG__){
    console.log(...msg);
  }
};

export { debug, __DEBUG__ };
