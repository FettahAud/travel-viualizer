#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float time;
uniform float lineDelay;

void main(){
    float dash = sin(vUv.x*2. - time *2.5);
    if( dash < 0.) discard;

    gl_FragColor = vec4(dash + 2., 0., 0., 1.0);
}