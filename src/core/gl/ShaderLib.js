
const ShaderLib = {
  point: {
    vertexShader:  `#version 300 es
    in vec3 a_position;

    uniform float uPointSize;

    void main( void ) {
      gl_PointSize = uPointSize;
      gl_Position = vec4( a_position, 1.0 );
    }`,

    fragmentShader:  `#version 300 es
    precision mediump float;

    out vec4 finalColor;

    void main( void ){
      finalColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    }`
  }
};

export { ShaderLib };
