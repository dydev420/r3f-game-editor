import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line, Text, useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody, TrimeshCollider } from "@react-three/rapier";
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion, Vector3 } from "three";
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
import LevelLights from "./LevelLights";
import CarPrefab from "../../prefabs/car/components/CarPrefab";
import GridRoadBlocks from "./GridRoadBlocks";
import useWaveAlt from "../hooks/useWaveAlt";
import useWaveCollapse from "../hooks/useWaveCollapse";
import useWaveSockets from "../hooks/useWaveSockets";
import useWaveRoads from "../hooks/useWaveRoads";
import Car from "../../vehicles/wheel/components/Car";
import MustangFrame from "../../models/MustangFrame";
import MustangWheel from "../../models/MustangWheel";

/**
 * Main Level Component
 */
export default function LevelWaveRoads({
  gridSize = GRID_SIZE,
  blockSize = BLOCK_SIZE,
}) {

  const initGrid = useLevelEditorStore(state => state.initGrid);

  /**
   * Wave Function Collapse Hooks
   */
  const { waveGrid } = useWaveRoads(gridSize);


  useEffect(() => {
    initGrid(gridSize);
  }, [gridSize]);

  useFrame(() => {
  });

return (
    <>
      <group>
        {
          waveGrid.current.map((item, i) => {
            return (
              <GridRoadBlocks
                key={`$grid-road-${i}`}
                cell={item.cell}
                blockSize={blockSize}
                type={item.type}
                collapsed={item.collapsed}
                meshRotation={item.rotation}
              />
            );
          })
        }
      </group>

      <Car spawnPosition={[4, 0.6, 4]} />

      <MustangFrame />
      <MustangWheel position={[0.5, 0.5, 2.5]} />

      <GridBounds gridSize={gridSize} blockSize={blockSize} />
      <LevelLights gridSize={gridSize} blockSize={blockSize} />

      <EditorGizmo />
    </>
  )
}
