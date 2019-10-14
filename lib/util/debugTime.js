const TimerLabels = {};
const Timers = {};

const debugTime = (label,  action) => {
  const __DEBUG__ = process.env.NODE_DEBUG_LOGGING ? true : false;

  if (__DEBUG__){
    const perf = require("perf_hooks");

    switch (action) {
    case "start":
      TimerLabels[label] = perf.performance;
      console.time(label);
      console.timeLog(label);
      break;

    case "mark":
      console.timeLog(label);
      break;

    case "end":
      console.timeLog(label);
      console.timeEnd(label);
      let _timer = TimerLabels[label].nodeTiming;
      Timers[label] = {
        name: _timer.name,
        duration: [_timer.duration.toString().split(".")[0], _timer.duration.toString().split(".")[1].slice(0,10)].join("."),
        environment: [_timer.environment.toString().split(".")[0], _timer.environment.toString().split(".")[1].slice(0,10)].join("."),
        bootstrapComplete: [_timer.bootstrapComplete.toString().split(".")[0], _timer.bootstrapComplete.toString().split(".")[1].slice(0,10)].join("."),
        timeOrigin: [TimerLabels[label].timeOrigin.toString().split(".")[0], TimerLabels[label].timeOrigin.toString().split(".")[1].slice(0,10)].join("."),
      };
      console.log([label,"END","\t"].join(" "), JSON.stringify(Timers[label]));
      TimerLabels[label] = null;
      break;

    default:
      console.timeLog(label);
      break;
    }
  }
};

export { debugTime };
