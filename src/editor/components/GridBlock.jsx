import { Float, Text, useCursor } from "@react-three/drei";
import { BoxGeometry, Color, MeshStandardMaterial } from "three";
import { BLOCK_FLOAT_HEIGHT, BLOCK_SIZE, TERRAIN_MATERIALS } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import useLevelEditorStore from "../stores/useLevelEditorStore";
import { useSpring, animated } from '@react-spring/three'
import actorMap from "../mappings/actors";


const floorIdleColor = 'limegreen';
const floorHoverColor = 'ForestGreen';
const floorSelectedColor = 'orange';
const boxGeometry = new BoxGeometry(1, 1, 1);
const floorMaterial = new MeshStandardMaterial({ color: floorIdleColor});

function GridBlock({
  cell = [0, 0],
  blockSize = BLOCK_SIZE,
  blockFloatHeight = BLOCK_FLOAT_HEIGHT
}) {
  const cellX = cell[0];
  const cellZ = cell[1];
  const cellName = `grid-block-${cellX}-${cellZ}`;

  /**
   * Store
   */
  const grid = useLevelEditorStore(state => state.grid);
  const setActiveBlock = useLevelEditorStore(state => state.setActiveBlock);
  const editorTarget = useLevelEditorStore(state => state.editorTarget);
  const updateTarget = useLevelEditorStore(state => state.updateTarget);
  const resetTarget = useLevelEditorStore(state => state.resetTarget);

  const gridBlock = grid[cellX]?.[cellZ];
  const terrainType = gridBlock?.terrainType;
  const actorType = gridBlock?.object?.name;
  const Actor = actorMap[actorType];

  /**
   * Refs
   */
  const floorMesh = useRef(null);
  const floorAnimGroup = useRef(null);

   /**
    * Selected State
    */
   const [selected, setSelected ] = useState(false);

   const [springs, api] = useSpring(() => {
    return {
      scale: [1, 1, 1],
      position: [0, 0, 0],
      };
    });

  /**
   * Methods
   */
  const updateFloorHoverColor = (isHover) => {
    if(selected) {
      return;
    }
    
    if(isHover) {
      floorMesh.current.material.color.set(floorHoverColor);
    } else {
      floorMesh.current.material.color.set(floorIdleColor);
    }
    
  };

  const updateFloorSelectedColor = (isSelected) => {
    if(isSelected) {
      floorMesh.current.material.color.set(floorSelectedColor);
    } else {
      floorMesh.current.material.color.set(floorIdleColor);
    }
  };

  /**
   * Event Handlers
   */
  const handleClick = (e) => {
    e.stopPropagation();

    setSelected(true);

    api.start({
      position: [0, blockFloatHeight, 0],
      scale: [1.3, 1, 1.3],
    });

    updateTarget(cellName, 'grid');
    setActiveBlock(cell);
  }

  const handlePointerMiss = (event) => {
    // Only handle click miss. NO Right click handling here
    if(event.type !== 'click') {
      return;
    }

    if(selected) {
      setSelected(false);

      api.start({
        position: [0, 0, 0],
        scale: [1, 1, 1],
      });
    }

    if(editorTarget.name === cellName) {
      resetTarget();
    }
  }

  const handleContextMenu = () => {
    // Should be left EMPTY to not interfere with orbit controls
    // when user is moving camera using right click
    cycleMode();
  }

  const handlePointerOver = () => {
    updateFloorHoverColor(true);
  }

  const handlePointerOut = () => {
    updateFloorHoverColor(false);
  }

  useEffect(() => {
    updateFloorSelectedColor(selected);
  }, [selected]);

  return(
    <group
      name={cellName}
      ref={grid[cellX][cellZ]?.terrainRef}
      position={[cellX * blockSize, 0, cellZ * blockSize]}
      onClick={handleClick}
      onPointerMissed={handlePointerMiss}
      onContextMenu={handleContextMenu}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
     <animated.group
        ref={floorAnimGroup}
        name="FloorAnimGroup"
        scale={springs.scale}
        position={springs.position}
      >
        {
          actorType && (
            <Actor />
          )
        }

        <mesh
          receiveShadow
          ref={floorMesh}
          position={[0, -0.1, 0]}
          scale={[blockSize, 0.2, blockSize]}
          // geometry={boxGeometry}
          // material={floorMaterial}
        >
          <boxGeometry />
          <meshStandardMaterial color={TERRAIN_MATERIALS[terrainType].color} />
        </mesh>
      </animated.group>
    </group>  
  );
}

export default GridBlock;