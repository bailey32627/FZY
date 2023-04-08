
const ShaderLib = {
  basic: {
    vertexShader:  `
    attribute vec3 position;
    void main() {
      gl_Position = vec4( position, 1.0 );
    }`,

    fragmentShader:  `
    precision mediump float;
    void main() {
      gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    }`
  }
}

export { ShaderLib };
