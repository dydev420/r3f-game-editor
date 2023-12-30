import React from 'react'
import { BoxGeometry, BufferAttribute, BufferGeometry, Float32BufferAttribute, MeshNormalMaterial, MeshStandardMaterial } from 'three';

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}

`;

const fragmentShader = `
varying vec2 vUv;

vec3 colorA = vec3(0.912,0.191,0.652);
vec3 colorB = vec3(1.000,0.777,0.052);

void main() {
  // "Normalizing" with an arbitrary value
  // We'll see a cleaner technique later :)   
 
  vec3 color = mix(colorA, colorB, vUv.x);

  gl_FragColor = vec4(color,1.0);
}

`;


const geometry  = new BufferGeometry();
const material = new MeshStandardMaterial();

const size = 20;
const segments = 10;

const halfSize = size / 2;
const segmentSize = size / segments;

const vertices = [
  -1, 1, 0,
  1, 1, 0,
  -1, -1, 0,
  1, -1, 0
];

const indices = [
  1, 0, 2,
  3, 1, 2
];
const normals = [
  0,0,1,
  0,0,1,
  0,0,1,
  0,0,1,
];

const uVs = [
  1,1,
  0,1,
  1,0,
  0,0
];

geometry.setIndex( indices );
geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
geometry.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
geometry.setAttribute( 'uv', new Float32BufferAttribute( uVs, 2 ) );


function ProceduralRoad(props) {
  return (
    <mesh {...props}
      geometry={geometry}
    >
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export default ProceduralRoad;
