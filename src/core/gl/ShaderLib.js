
const ShaderLib = {
  basic: {
    vertexShader:  `#version 300 es
    in vec3 a_position;

    void main( void ) {
      gl_Position = vec4( a_position.x * 0.5, a_position.y * 0.5, a_position.z * 0.5, 1.0 );
    }`,

    fragmentShader:  `#version 300 es
    precision mediump float;

    out vec4 finalColor;

    void main( void ){
      finalColor = vec4( 0.3, 0.4, 0.5, 1.0 );
    }`
  }
};

export { ShaderLib };
