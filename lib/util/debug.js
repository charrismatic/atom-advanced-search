const __DEBUG__ = process.env.NODE_DEBUG_LOGGING ? true : false;

const debug = (...msg) => {
  var util = require("util");
  function _inspect(data){
    console.log(util.inspect(data, true,3, true));
  }

  if (__DEBUG__){
    _inspect(...msg);
    // console.log({...msg});
  }
};

export { debug, __DEBUG__ };
