
  // convert degrees to radians
  const degreesToRadians = (degrees) => { return degrees * ( Math.PI / 180.0 ); }

  // convert radians to degrees
  const radianToDegrees = (radians) => { return radians / ( Math.PI / 180.0 ); }

  // clamps the given value between the bottom and top values
  const clamp = (value, bottom, top ) => { return value < bottom ? bottom : ( value > top ? top : value ); }

  // return true if the value is between top and bottom
  const between = ( value, bottom, top ) => { return value < bottom ? 0 : ( value > top ? 0 : 1 ); }

  // linear interpolates the value a and b by the given ratio
  const lerp = ( a, b, ratio ) => { return (b-a) * ratio + a; }

  // a smooth version of the linear interpolation
  const smooth_step = (a, b, ratio ) => { return (b-a) * ( ratio * ratio * ( 3 - 2 * ratio ) ) + a; }

  // a smoother step version of linear interpolation
  const smoother_step = (a, b, ratio) => { return (b-a) * (ratio * ratio * ratio * (ratio*(ratio * 6 - 15 ) + 10 ) ) + a; }

  // convert ms to seconds
  const millisecondsToSeconds = (ms) => { return ms * 0.001; }

  // convert seconds to ms
  const secondsToMilliseconds = (s) => { return s * 1000.0; }

  // return true if the value is a power of 2
  const isPowerOf2 = (v) => { return v !== 0 ? ( ( v & (v - 1) ) === 0 ? 1: 0 ) : 0; }

  // returns a value in the given range
  const randomInRange = (bottom, top ) => { return Math.random() * (top-bottom)+bottom; }

  // smallest positive number
  const EPSILON = 1.192092896e-07;

export { degreesToRadians,
         radianToDegrees,
         clamp,
         between,
         lerp,
         smooth_step,
         smoother_step,
         millisecondsToSeconds,
         secondsToMilliseconds,
         isPowerOf2,
         randomInRange,
         EPSILON
       }
