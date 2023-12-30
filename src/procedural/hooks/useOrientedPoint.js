import { useRef } from "react";
import { Quaternion, Vector3 } from "three";


const useOrientedPoint = (props) => {
  /**
   * Refs
   */
  const trackerMeshRef = useRef();
  const controlPointRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  
  /**
   * Methods
   */
  const getBezierPoint = (t = 0.5) => {
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
    const fPos = new Vector3(0, 0, 0);
    // Layer F
    const vDir = new Vector3(0, 0, 0);
    const fUnit = new Vector3(0, 0, 1); // !! CHECK THIS, y vs z as forward axis

    // MAYBE NOT :: Should use Local Space Position here, instead of world space.
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

    vDir.subVectors(ePos, dPos);
    vDir.normalize();

    const fRot = new Quaternion();
    // NOT CORRECT: find alternative for Quaternion.lookRotation(vec) from unity
    fRot.setFromUnitVectors(fUnit, vDir);

    return { fPos, fRot };
  }


  return {
    trackerMeshRef,
    controlPointRefs,
    getBezierPoint,
  }
};

export default useOrientedPoint;
