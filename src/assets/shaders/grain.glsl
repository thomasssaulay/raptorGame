---
name: Grain
type: fragment
author: Hi mom
---
precision mediump float;
uniform float amount;
uniform sampler2D tDiffuse;
uniform vec2 vUv;


float noise(vec2 seed)
{
    float x = (seed.x / 3.14159 + 4) * (seed.y / 5.49382 + 4) * ((fract(time) + 1));
    return mod((mod(x, 13) + 1) * (mod(x, 123) + 1), 0.01) - 0.005;
}

float random( vec2 p )
{
  vec2 K1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );
return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void main() {
  vec4 color = texture2D( tDiffuse, vUv );
  vec2 uvRandom = vUv;
  uvRandom.y *= random(vec2(uvRandom.y,amount));
  color.rgb += random(uvRandom)*0.15;
  gl_FragColor = vec4( color );
}


---
name: Grain3
type: fragment
author: Hi mom
---
precision mediump float;
uniform vec3 uColor;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform float uNoiseScale;

varying vec3 vNormal;
varying vec3 vSurfaceToLight;

vec3 light_reflection(vec3 lightColor) {
  // AMBIENT is just the light's color
  vec3 ambient = lightColor;

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // DIFFUSE  calculations
  // Calculate the cosine of the angle between the vertex's normal
  // vector and the vector going to the light.
  vec3 diffuse = lightColor * max(dot(vSurfaceToLight, vNormal), 0.0);

  // Combine 
  return (ambient + diffuse);
}

void main(void) {
  vec3 light_value = light_reflection(uLightColor);
  light_value *= uLightIntensity;

  // grain
  vec2 uv = gl_FragCoord.xy;
  uv /= uNoiseScale;

  vec3 colorNoise = vec3(snoise2(uv) * 0.5 + 0.5);
  colorNoise *= pow(light_value.r, 5.0);

  gl_FragColor = vec4(colorNoise, 1.0);
}