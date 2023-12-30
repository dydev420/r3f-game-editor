import React, { useEffect, useRef, useState } from 'react'
import { BufferGeometry, Float32BufferAttribute, MeshNormalMaterial, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useSpring, animated } from '@react-spring/three';
import { Line, TransformControls, useTexture } from '@react-three/drei';
import useOrientedPoint from '../hooks/useOrientedPoint';
import useRoadMesh2D from '../hooks/useRoadMesh2D';

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

const zUpDir = new Vector3(0, 0, 1);
const rightDir = new Vector3(1, 0, 0);

const CONTROL_POINT_SCALE = 2;
const controlPoints = [
  new Vector3(0, 0.001, 0),
  new Vector3(0, 0.001, 1),
  new Vector3(1, 0.001, 1),
  new Vector3(1, 0.001, 0),
];
controlPoints.forEach((point) => {
  point.multiplyScalar(CONTROL_POINT_SCALE);
});


const roadGeometry = new BufferGeometry();
// const roadMaterials = new MeshStandardMaterial({ color: "orange", wireframe: false ,flatShading: true });
const roadMaterials = new MeshNormalMaterial({ flatShading: true });

function RoadSegment(props) {
  /**
   * Leva Debug
   */
  const { tBezier } = useControls({
    tBezier: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.001,
      onChange: (value) => {
        handleTDebug(value);
      }
    }
  });
  const [{tSegments}, set] = useControls(() => ({
    tSegments: {
      value: 8,
      min: 1,
      max: 32,
      step: 1,
      onChange: (value) => {
        handleSDebug(value);
      }
    }
  }));

  const testControlGroupRef = useRef();

  /**
   * Texture Loader
   */
  const roadTextureMap = useTexture('/RoadTexture.png');

  /**
   * State Refs
   */
  const sRef = useRef(8);
  const tRef = useRef(0.5);

  /**
   * Bezier Point Hook
   */
  const {
    trackerMeshRef,
    controlPointRefs,
    getBezierPoint
  } = useOrientedPoint();

  const {
    pointsRef : debugRoadPoints,
    linesRef: debugRoadLines,
    points: roadVerts,
    normals: roadNormals,
    us: roadUs,
    lineIndices: roadLineIndices,
    getRoadPointAtIndex,
    getRoadLineAtIndex,
    getLocalToWorldPos,
    getLocalToWorldRot,
    // getUSpan,
  } = useRoadMesh2D();

  /**
   * Springs
   */
  const [springs, api] = useSpring(() => {
    return {
      position: [0, 0, 0],
      config: {
        mass: 1,
        friction: 15,
        tension: 200,
      },
    };
  });


  /**
   * Methods
   */

  /**
   * Get USpan??
   */
  const getUSpan = () => {
    let distance = 0;

    for (let lIndex = 0; lIndex < roadLineIndices.current.length; lIndex++) {
      const [lineIndexA , lineIndexB] = roadLineIndices.current[lIndex];
  
      const uA = new Vector3(...roadVerts.current[lineIndexA]);
      const uB = new Vector3(...roadVerts.current[lineIndexB]);

      const diff = new Vector3(0, 0, 0);

      diff.subVectors(uA, uB);

      distance += diff.length();
    }
    return distance;
  } 

  /**
   * Get Approx bezier curve length
   * to scale UVs based on  length
   */
  const getApproxCurveLength = (precision = 8) => {
      let bPoints = [];
      let distance = 0;

      for (let i = 0; i < precision; i++) {
        const t = i / (precision - 1);
        const {fPos} = getBezierPoint(t);

        
        console.log(t, fPos);
        bPoints.push(fPos);
      }

      for (let i = 0; i < precision - 1 ; i++) {
        const pointA = bPoints[i];
        const pointB = bPoints[i+1];


        const diff = new Vector3(0, 0, 0);

        diff.subVectors(pointA , pointB);

        const pointDist = diff.length();

        distance += pointDist;
      }

      return distance;
  }

  /**
   * Generates a Buffer geometry based on positions of road points
   */
  const generateMesh = () => {
    const segments = sRef.current;

    roadGeometry.dispose();

    const geoVerticesF32 = [];
    const geoNormalsF32 = [];
    const geoUVsF32 = [];
    const geoTrianglesF32 = [];

    const uSpan = getUSpan();
    

    // Push Vertices to f32Array
    for (let rIndex = 0; rIndex < segments; rIndex++) {
      const t = rIndex / (segments - 1);
      const {fPos, fRot} = getBezierPoint(t);

      for (let i = 0; i < roadVerts.current?.length; i++) {
        const wPos = getLocalToWorldPos(fPos, fRot, roadVerts.current[i]);
        const wRot = getLocalToWorldRot(fRot, roadNormals.current[i]);
        let u = roadUs.current[i];
  
        // const uv = [u, t * getApproxCurveLength() / (uSpan)];
        const uv = [u, t];

        console.log();
        
        geoVerticesF32.push(...wPos.toArray());
        geoNormalsF32.push(...wRot.toArray());
        geoUVsF32.push(...uv);
      }
    }

    // Push triangle indices to f32Array
    for (let rIndex = 0; rIndex < segments - 1; rIndex++) {
      const rootIndex = rIndex * roadVerts.current.length;
      const rootNextIndex = (rIndex + 1) * roadVerts.current.length;

      for (let lIndex = 0; lIndex < roadLineIndices.current.length; lIndex++) {
        const [lineIndexA , lineIndexB] = roadLineIndices.current[lIndex];
      
        const currentA = rootIndex + lineIndexA;
        const currentB = rootIndex + lineIndexB;
        const nextA = rootNextIndex + lineIndexA;
        const nextB = rootNextIndex + lineIndexB;

        geoTrianglesF32.push(currentA, nextA, nextB);
        geoTrianglesF32.push(currentA, nextB, currentB);
      }
    }

    roadGeometry.setIndex( geoTrianglesF32 );
    roadGeometry.setAttribute( 'position', new Float32BufferAttribute( geoVerticesF32, 3 ) );
    roadGeometry.setAttribute( 'normal', new Float32BufferAttribute( geoNormalsF32, 3 ) );
    roadGeometry.setAttribute( 'uv', new Float32BufferAttribute( geoUVsF32, 2 ) );
    roadGeometry.attributes.position.needsUpdate = true;
    roadGeometry.attributes.normal.needsUpdate = true;
    roadGeometry.attributes.uv.needsUpdate = true;
  }

  const updateDebugRoadPoints = (fPos, fRot) => {
    debugRoadPoints.forEach((ref, index) => {
      const roadPoint = getRoadPointAtIndex(index);
      const pos = roadPoint.position;

      const rPos = getLocalToWorldPos(fPos, fRot, pos);
      
      ref?.current?.position.copy(rPos);
      ref?.current?.setRotationFromQuaternion(fRot);
    });
  
  }

  const handleTChange = () => {
    const t = tRef.current;
    
    const {fPos, fRot} = getBezierPoint(t);
    trackerMeshRef.current.setRotationFromQuaternion(fRot);

    updateDebugRoadPoints(fPos, fRot);

    generateMesh();

    api.start({
      position: [...fPos]
    });
  }
  const handleSChange = () => {
    generateMesh();
  }

  const handleTDebug = (t) => {
    tRef.current = t;
    handleTChange();
  }

  const handleSDebug = (segments) => {
    sRef.current = segments;
    handleSChange(segments);
  }

  const handleControlMove = () => {
    handleTChange();
  }

  const handleControlGroupMove = () => {
    generateMesh();
  }

  return (
    <group>
      <group ref={testControlGroupRef}>
          {
          controlPoints.map((point, index) => {
            return (
              <mesh
              ref={controlPointRefs[index]}
              position={point}
              scale={0.05}
              >
                <sphereGeometry />
                <meshStandardMaterial color="#ffaaaa" />
              </mesh>
            )
          })
        }
      </group>

      <TransformControls
        position={[1, 1, 0]} size={1}
        object={testControlGroupRef}
        onObjectChange={handleControlGroupMove}  
      />
      {
        controlPoints.map((point, index) => {
          return (
            <TransformControls
              size={0.25}
              object={controlPointRefs[index]}
              onObjectChange={handleControlMove}
            />
          )
        })
      }

      {
        debugRoadPoints.map((ref, index) => {
          return (
            <mesh ref={ref} scale={0.05}>
              <boxGeometry />
              <meshStandardMaterial color="blue" />
            </mesh>
          )
        })
      } 

      {/* Tracker */}
      <animated.mesh
        ref={trackerMeshRef}
        scale={0.1}
        position={springs.position}
      >
        <cylinderGeometry />
        <meshStandardMaterial color="red" />
      </animated.mesh>

      <mesh
        geometry={roadGeometry}
        // material={roadMaterials}
      >
        <meshStandardMaterial map={roadTextureMap} />
        {/* <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} /> */}
      </mesh>
    </group>
  )
}

export default RoadSegment;
