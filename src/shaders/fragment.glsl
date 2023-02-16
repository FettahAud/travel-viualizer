#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float time;

void main(){
    float dash = sin(vUv.x*50. - time * 10.);
    if( dash < 0.) discard;

    gl_FragColor = vec4(vUv.x, 0., 0., 1.0);
}