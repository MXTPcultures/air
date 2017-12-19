uniform vec3 pulseColor;
varying float intensity;
void main() 
{
    vec3 glow = pulseColor * intensity;
    gl_FragColor = vec4( glow, 1.0 );
}
