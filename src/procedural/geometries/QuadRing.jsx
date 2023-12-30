import React from 'react'
import { BoxGeometry, BufferAttribute, BufferGeometry, Float32BufferAttribute, MeshNormalMaterial, MeshStandardMaterial, Vector2, Vector3 } from 'three';

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

  // gl_FragColor = vec4(color,1.0);
  gl_FragColor = vec4(vUv.xy, 1.0 , 1.0);
}

`;

const zUpDir = new Vector3(0, 0, 1);

const geometry  = new BufferGeometry();
// const material = new MeshStandardMaterial();
const material = new MeshNormalMaterial({ wireframe: true});

const segments = 64;

const vCount = (segments + 1) * 2;

const uvProjectionTypes = [
  'angular',
  'projectZ'  
];
const activeProjection = uvProjectionTypes[0];


const radiusInner = 2;
const thickness = 2;
const radiusOuter = radiusInner + thickness;

const vertices = [];
const normals = [];
const indices = [];
const uvs = [];


for ( let i = 0; i <= segments; i ++ ) {
  const t = i / segments;
  const angRad = 2 * Math.PI * t;
  const dir = new Vector3(1, 0, 0);
  const inPos = new Vector3();
  const outPos = new Vector3();
  const halfVec2 = new Vector3(0.5, 0.5, 0);
  

  dir.normalize();
  dir.applyAxisAngle(zUpDir, angRad);
  inPos.copy(dir);
  outPos.copy(dir);

  inPos.multiplyScalar(radiusInner);
  outPos.multiplyScalar(radiusOuter);

  const zOffset = Math.cos(angRad * 4);
  inPos.z += zOffset;
  outPos.z +=zOffset;

  vertices.push(...outPos);
  vertices.push( ...inPos );

  
  // Push based on active projection type
  switch(activeProjection) {
    case uvProjectionTypes[0] : {
      uvs.push(t, 1);
      uvs.push(t, 0);

      break;
    }
    case uvProjectionTypes[1]: {
      const halfDir = dir.clone().multiplyScalar(0.5);
      const halfDirDisk = dir.clone().multiplyScalar((radiusInner / radiusOuter) * 0.5);
      let uOuter = halfDir.add(halfVec2);
      let uInner = halfDirDisk.add(halfVec2);

      uvs.push(uOuter.x, uOuter.y);
      uvs.push(uInner.x, uInner.y);

      break;
    }
    default: break;
  }
}

for ( let i = 0; i <= segments; i ++ ) {
  const indexRoot = i * 2;
  const indexInnerRoot = (indexRoot + 1);
  const indexOuterNext = (indexRoot + 2) % vCount;
  const indexInnerNext = (indexRoot + 3) % vCount;

  indices.push(indexRoot, indexOuterNext, indexInnerNext);
  indices.push(indexRoot, indexInnerNext, indexInnerRoot);

  normals.push(...zUpDir);
  normals.push(...zUpDir);
}

geometry.setIndex(indices);
geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
geometry.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
geometry.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );


function QuadRing(props) {
  return (
    <mesh {...props}
    position={[-3, 0, 0]}
      geometry={geometry}
      // material={material}
    >
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export default QuadRing;
