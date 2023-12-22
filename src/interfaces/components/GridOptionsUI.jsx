
import { useEffect, useRef } from "react";
import useLevelEditorStore from "../../editor/stores/useLevelEditorStore";
import { addEffect, useFrame } from "@react-three/fiber";

function GridOptionsUI() {
  /**
   * Refs
   */
  const uiRef = useRef();
 
 useEffect(() => {
  const unsubscribeEffect = addEffect(() => {
    const state = useLevelEditorStore.getState();

    const editorTarget = state.editorTarget;
    const currentDomDisplay = uiRef.current.style.display;
    const showGridOptions = editorTarget.type === 'grid';

  
    if(showGridOptions) {
      if(currentDomDisplay !== 'block') {
        uiRef.current.style.display = 'block';
      }
    } else {
      if(currentDomDisplay !== 'none') {
        uiRef.current.style.display = 'none';
      }
    }
  });

  return () => {
    unsubscribeEffect();
  }
 }, []);

  return (
    <div ref={uiRef} className="grid-options">
      <div className="card-stack">
        <div className="card" onClick={(e) => { console.log('clocked');}}></div>
        <div className="card"></div>
        <div className="card"></div>
      </div>
    </div>
  );
}

export default GridOptionsUI;
