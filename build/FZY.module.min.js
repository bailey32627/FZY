class Vector2 {
  constructor( x = 0, y = 0 ) {
    this.x = x;
    this.y = y;
  }

  width( ) {
    return this.x;
  }

  height() {
    return this.y;
  }
}

export { Vector2 };
