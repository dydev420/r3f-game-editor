import React, { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useSpring, animated } from '@react-spring/three';
import { TransformControls } from '@react-three/drei';

const zUpDir = new Vector3(0, 0, 1);
const controlPoints = [
  new Vector3(0, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(1, 1, 0),
  new Vector3(1, 0, 0),
];

/**
 * Bezier curve temp vectors
 */
const wPos0 = new Vector3(0, 0, 0);
const wPos1 = new Vector3(0, 0, 0);
const wPos2 = new Vector3(0, 0, 0);
const wPos3 = new Vector3(0, 0, 0);

// Layer 1
const aPos = new Vector3(0, 0, 0);
const bPos = new Vector3(0, 0, 0);
const cPos = new Vector3(0, 0, 0);

// Layer 2
const dPos = new Vector3(0, 0, 0);
const ePos = new Vector3(0, 0, 0);

// Layer F
const fPos = new Vector3(0, 0, 0);


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

  /**
   * Refs
   */
  const trackerMesh = useRef();
  const tRef = useRef(0.5);
  const controlPointRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

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
  const getBezierPoint = (t = 0.5) => {
    controlPointRefs[0].current?.getWorldPosition(wPos0);
    controlPointRefs[1].current?.getWorldPosition(wPos1);
    controlPointRefs[2].current?.getWorldPosition(wPos2);
    controlPointRefs[3].current?.getWorldPosition(wPos3);

    // Layer 1
    aPos.lerpVectors(wPos0, wPos1, t);
    bPos.lerpVectors(wPos1, wPos2, t);
    cPos.lerpVectors(wPos2, wPos3, t);
    
    // Layer 2
    dPos.lerpVectors(aPos, bPos, t);
    ePos.lerpVectors(bPos, cPos, t);
    
    // Point
    fPos.lerpVectors(dPos, ePos, t);

    return fPos
  }

  
  
  const handleTChange = () => {
    const t = tRef.current;
    
    const newPos = getBezierPoint(t);

    api.start({
      position: [...newPos]
    });
  }

  const handleTDebug = (t) => {
    tRef.current = t;

    handleTChange();
  }

  const handleControlMove = () => {
    handleTChange();
  }


  return (
    <group>
      {
        controlPoints.map((point, index) => {
          return (
              <group>
                <mesh
                ref={controlPointRefs[index]}
                position={point}
                scale={0.05}
                >
                  <sphereGeometry />
                  <meshStandardMaterial color="#ffaaaa" />
                </mesh>
                <TransformControls
                  size={0.25}
                  object={controlPointRefs[index]}
                  onObjectChange={handleControlMove}
                />
              </group>
          )
        })
      }

      {/* Tracker */}
      <animated.mesh
        ref={trackerMesh}
        scale={0.1}
        position={springs.position}
      >
        <cylinderGeometry />
        <meshStandardMaterial color="red" />
      </animated.mesh>
    </group>
  )
}

export default RoadSegment;
