
import { useEffect, useRef } from "react";
import useLevelEditorStore from "../../editor/stores/useLevelEditorStore";
import { addEffect, useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/web"
import { TERRAIN_MATERIALS } from "../../editor/utils/constants";

function GridOptionsUI() {
  /**
   * Refs
   */
  const uiRef = useRef();
  const buttonGroupRef = useRef();
  
  const editorTarget = useLevelEditorStore(state => state.editorTarget);
  const activeGridCell = useLevelEditorStore(state => state.activeGridCell);
  const setBlockTerrain = useLevelEditorStore(state => state.setBlockTerrain);

  const showGridOptions = editorTarget.type === 'grid';

  /**
   * Animation Springs
   */
  const fadeIn = useSpring({
    opacity: showGridOptions ? 1 : 0,
  });

  const jumpIn = useSpring({
    transform: showGridOptions ? 'scaleY(100%)': 'scaleY(0%)',
    config: {
      friction: 20,
      tension: 500,
    },
  });

  /**
   * Event handler
   */
  const handleTerrainOptionClick = (e) => {
    const terrainType = e.target.id;

    console.log('Terrain type Selected from UI ::', terrainType, activeGridCell);

    setBlockTerrain(activeGridCell, terrainType);
  }

  useEffect(() => {
    buttonGroupRef.current?.childNodes.forEach((card) => {
      const terrainType = card.id;
      const bgColor = TERRAIN_MATERIALS[terrainType]?.color;

      card.style.backgroundColor = bgColor;
    });

    console.log('active drid', activeGridCell);
  }, [activeGridCell]);
  

  return (
    <animated.div ref={uiRef} style={fadeIn} className="grid-options">
      <animated.div ref={buttonGroupRef} style={jumpIn} className="card-stack">
        <div className="card" id="grass" onClick={handleTerrainOptionClick}>Grass</div>
        <div className="card" id="water" onClick={handleTerrainOptionClick}>Water</div>
        <div className="card" id="road" onClick={handleTerrainOptionClick}>Road</div>
        <div className="card" id="ground" onClick={handleTerrainOptionClick}>Ground</div>
      </animated.div>
    </animated.div>
  );
}

export default GridOptionsUI;
