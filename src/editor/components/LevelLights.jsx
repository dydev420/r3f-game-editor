import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line, Text, useGLTF, useHelper } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion, Vector3 } from "three";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { BlockAxe, BlockEnd, BlockLimbo, BlockSpinner, BlockStart, Bounds } from "./LevelBlocks";
import EditorGizmo from "./EditorGizmo";
import EditorActor from "./EditorActor";
import useLevelEditorStore from "../stores/useLevelEditorStore";
import GridBlock from "./GridBlock";
import { BLOCK_SIZE, GRID_SIZE } from "../utils/constants";
import GridBounds from "./GridBounds";
import Astro from "../../models/Astro";
import { Sage } from "../../models/Sage";
import Boxy from "../../models/Boxy";
import actorMap from "../mappings/actors";
import RoadSegment from "../../procedural/geometries/RoadSegment";
import EmissiveShapes from "./EmissiveShapes";

/**
 * Debug Lights
 */

const debugLights = [
  {
    type: 'point',
    position: [4, 1, 4],
    intensity: 10,
    color: 'red'
  },
  {
    type: 'point',
    position: [2, 1, 2],
    intensity: 10,
    color: 'blue'
  },
  {
    type: 'point',
    position: [4, 1, 1],
    intensity: 10,
    color: 'magenta'
  },
]

/**
 * Main Level Component
 */
export default function LevelLights({
  gridSize = GRID_SIZE,
  blockSize = BLOCK_SIZE,
}) {
  /**
   * Light helpers
   */
  const rectL1 = useRef(null);
  const rectL2 = useRef(null);
  useHelper(rectL1, RectAreaLightHelper);
  useHelper(rectL2, RectAreaLightHelper);

return (
    <>
      <rectAreaLight
        ref={rectL1}
        color="magenta"
        intensity={10}
        width={gridSize * blockSize}
        height={1}
        position={[-blockSize/2, 0.5, (gridSize * blockSize) /2 - blockSize /2]}
        rotation={[0, -Math.PI/2, 0]}  
      />
      <rectAreaLight
        ref={rectL2}
        color="blue"
        intensity={10}
        width={gridSize * blockSize}
        height={1}
        position={[(gridSize * blockSize) - blockSize /2, 0.5, (gridSize * blockSize) /2 - blockSize /2]}
        rotation={[0, Math.PI/2, 0]}
      />
    </>
  )
}
