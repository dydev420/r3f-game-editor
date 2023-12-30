import { Float, Text, useCursor } from "@react-three/drei";
import { BoxGeometry, Color, MeshStandardMaterial } from "three";
import { BLOCK_FLOAT_HEIGHT, BLOCK_SIZE, TERRAIN_MATERIALS } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import useLevelEditorStore from "../stores/useLevelEditorStore";
import { useSpring, animated } from '@react-spring/three'
import actorMap from "../mappings/actors";

const ROAD_WIDTH = 0.4;
const CONNECTOR_LENGTH = 0.3;
const CONNECTOR_OFFSET = (ROAD_WIDTH + CONNECTOR_LENGTH) / 2;

const blankColor = 'black';
const roadColor = 'black';
const roadUpColor = 'blue';
const roadRightColor = 'yellow';
const roadDownColor = 'orange';
const roadLeftColor = 'magenta';
const roadGeometry = new BoxGeometry(1, 1, 1);
const roadMaterial = new MeshStandardMaterial({ color: roadColor});
const roadUpMaterial = new MeshStandardMaterial({ color: roadUpColor});
const roadRightMaterial = new MeshStandardMaterial({ color: roadRightColor});
const roadDownMaterial = new MeshStandardMaterial({ color: roadDownColor});
const roadLeftMaterial = new MeshStandardMaterial({ color: roadLeftColor});
const blankMaterial = new MeshStandardMaterial({ color: blankColor});

function RoadStraightH(props) {
  const yRotationNum = props.meshRotation || 0;
  return (
    <group rotation={[0, -(Math.PI /2) * yRotationNum, 0]} {...props}>
      <mesh
        geometry={roadGeometry}
        material={roadMaterial}
        scale={[1, 0.1, ROAD_WIDTH]}
      />
    </group>
  );
}

function RoadConnectUp(props) {
  return (
    <group {...props}>
      <mesh
        geometry={roadGeometry}
        material={roadUpMaterial}
        scale={[1, 0.1, ROAD_WIDTH]}
      />
      <mesh
        geometry={roadGeometry}
        material={roadUpMaterial}
        scale={[ROAD_WIDTH, 0.1, CONNECTOR_LENGTH]}
        position={[0, 0, CONNECTOR_OFFSET]}
      />
    </group>
  );
}


function RoadConnectDown(props) {
  return (
    <group {...props}>
      <mesh
        geometry={roadGeometry}
        material={roadDownMaterial}
        scale={[1, 0.1, ROAD_WIDTH]}
      />
      <mesh
        geometry={roadGeometry}
        material={roadDownMaterial}
        scale={[ROAD_WIDTH, 0.1, CONNECTOR_LENGTH]}
        position={[0, 0, -CONNECTOR_OFFSET]}
      />
    </group>
  );
}

function RoadStraightV(props) {
  return (
    <group {...props}>
      <mesh
        geometry={roadGeometry}
        material={roadMaterial}
        scale={[ROAD_WIDTH, 0.1, 1]}
      />
    </group>
  );
}

function RoadConnectLeft(props) {
  return (
    <group {...props}>
      <mesh
        geometry={roadGeometry}
        material={roadLeftMaterial}
        scale={[ROAD_WIDTH, 0.1, 1]}
      />
      <mesh
        geometry={roadGeometry}
        material={roadLeftMaterial}
        scale={[CONNECTOR_LENGTH, 0.1, ROAD_WIDTH]}
        position={[CONNECTOR_OFFSET, 0, 0]}
      />
    </group>
  );
}

function RoadConnectRight(props) {
  return (
    <group {...props}>
      <mesh
        geometry={roadGeometry}
        material={roadRightMaterial}
        scale={[ROAD_WIDTH, 0.1, 1]}
      />
      <mesh
        geometry={roadGeometry}
        material={roadRightMaterial}
        scale={[CONNECTOR_LENGTH, 0.1, ROAD_WIDTH]}
        position={[-CONNECTOR_OFFSET, 0, 0]}
      />
    </group>
  );
}

function RoadBlank(props) {
  return (
    <group {...props}>
      <mesh
        geometry={roadGeometry}
        material={blankMaterial}
        scale={[0.05, 0.05, 0.05]}
      />
    </group>
  );
}

function RoadConnect(props) {
  const yRotationNum = props.meshRotation || 0;

  return (
    <group rotation={[0, -(Math.PI /2) * yRotationNum, 0]} {...props}>
      <mesh
        geometry={roadGeometry}
        material={roadUpMaterial}
        scale={[1, 0.1, ROAD_WIDTH]}
      />
      <mesh
        geometry={roadGeometry}
        material={roadUpMaterial}
        scale={[ROAD_WIDTH, 0.1, CONNECTOR_LENGTH]}
        position={[0, 0, CONNECTOR_OFFSET]}
      />
    </group>
  );
}

function RoadCornerUp(props) {
  const yRotationNum = props.meshRotation || 0;

  return (
    <group rotation={[0, -(Math.PI /2) * yRotationNum, 0]} {...props}>
      <mesh
        geometry={roadGeometry}
        material={blankMaterial}
        scale={[ROAD_WIDTH, 0.1, ROAD_WIDTH]}
      />
      <mesh
        geometry={roadGeometry}
        material={roadUpMaterial}
        scale={[ROAD_WIDTH, 0.1, CONNECTOR_LENGTH]}
        position={[0, 0, CONNECTOR_OFFSET]}
      />
      <mesh
        geometry={roadGeometry}
        material={roadUpMaterial}
        scale={[CONNECTOR_LENGTH, 0.1, ROAD_WIDTH]}
        position={[-CONNECTOR_OFFSET, 0, 0]}
      />
    </group>
  );
}


export const roadBlockTypes = {
  'straightH': RoadStraightH,
  'straightV': RoadStraightV,
  'connectBlank': RoadBlank,
  'connectRoad': RoadConnect,
  'cornerUp': RoadCornerUp,
  'connectUp': RoadConnectUp,
  'connectRight': RoadConnectRight,
  'connectDown': RoadConnectDown,
  'connectLeft': RoadConnectLeft,
};



function GridRoadBlocks({
  cell = [0, 0],
  blockSize = BLOCK_SIZE,
  type = 'connectUp',
  meshRotation = 0
}) {
  const cellX = cell[0];
  const cellZ = cell[1];
  const cellName = `grid-road-${cellX}-${cellZ}`;

  /**
   * Refs
   */
  const floorMesh = useRef(null);
  const floorAnimGroup = useRef(null);

  /** variable render component */
  const RoadBlockType = roadBlockTypes[type];

  return(
    <group
      name={cellName}
      position={[cellX * blockSize, 0, cellZ * blockSize]}
    >
      {
        RoadBlockType &&
          <RoadBlockType
            meshRotation={meshRotation}
            position={[0, -0.05 * blockSize, 0]}
            scale={blockSize}
          />
      }   
    </group>  
  );
}

export default GridRoadBlocks;