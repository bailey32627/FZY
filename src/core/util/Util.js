
class Util {

  _nextID = 0;

  /**
  @brief Generates a random Id
  */
  randomID() {
    return (+new Date()) + (Math.random() * 100000000 | 0) + (++this._nextID);
  }

  /**
  @brief creates a hash int based on the string input
  @param str String input
  */
  hashCode( str ) {
    let hash = 5381, i = str.length;
    while( i ) {
      hash = ( hash * 33 ) ^ str.charCodeAt( --i );
    }
    return hash >>> 0; // force Negative bit to positive
  }
}


export { Util };
