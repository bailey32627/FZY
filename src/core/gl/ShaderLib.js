
const ShaderLib = {
  point: {
    vertexShader:  `#version 300 es
    in vec3 a_position;

    uniform mediump float uPointSize;
    uniform float uAngle;

    void main( void ) {
      gl_PointSize = uPointSize;
      gl_Position = vec4(
        cos(uAngle) * 0.8 * a_position.x,
        sin(uAngle) * 0.8 * a_position.y,
        a_position.z, 1.0 );
    }`,

    fragmentShader:  `#version 300 es
    precision mediump float;

    uniform float uPointSize;

    out vec4 finalColor;

    void main( void ){
      float c = ( 40.0 - uPointSize ) / 20.0;
      finalColor = vec4( c, c, c, 1.0 );
    }`
  }
};

export { ShaderLib };
