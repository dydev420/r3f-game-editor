import { useRef } from "react";
import { Quaternion, Vector2, Vector3 } from "three";
import { roadLineIndices, roadLocalPoints } from "../geometries/utils/roads";

const rightDir = new Vector3(1, 0, 0);
const upDir = new Vector3(0, -1, 0);

const MESH_2D_SCALE = 0.1;


const useRoadMesh2D = (props) => {
  /**
   * Debug Refs
   */
  const pointsRef = roadLocalPoints.map(() => {
    return useRef();
  });
  const linesRef = roadLineIndices.map(() => {
    return useRef();
  });

  /**
   * State Refs
   */
  const points = useRef(roadLocalPoints.map((point) => {
    return [point.position[0] * MESH_2D_SCALE, point.position[1] * MESH_2D_SCALE, 0];
  }));
  const normals = useRef(roadLocalPoints.map((point) => {
    return [point.normal[0], point.normal[1], 0];
  }));
  const us = useRef(roadLocalPoints.map((point) => {
    return point.u
  }));

  const lineIndices = useRef(roadLineIndices);
  
  /**
   * Methods
   */
  const getRoadPointAtIndex = (index) => {
    return {
      position: points.current?.[index],
      normal: normals.current?.[index],
    };
  }

  const getRoadLineAtIndex = (index) => {
    const i1 = roadLineIndices[index][0];
    const i2 = roadLineIndices[index][1];
    return [
      points.current?.[i1],
      points.current?.[i2],
    ];
  }

  /**
   * Local Point to rotated world position
   */
  const getLocalToWorldPos = (fPos, fRot, xyPos = [0, 0]) => {
    const rwPos = new Vector3(...xyPos);

    rwPos.applyQuaternion(fRot);

    rwPos.add(fPos);

    return rwPos;
  }

  /**
   * Local Point rotation in world space
   */
  const getLocalToWorldRot = (fRot, xyPos = [0, 0]) => {
    const rwPos = new Vector3(...xyPos);

    rwPos.applyQuaternion(fRot);

    return rwPos;
  }

  /**
   * get sum of distance by uv in u direction
   */
  const getUSpan = () => {
    let distance = 0;

    for (let lIndex = 0; lIndex < lineIndices.current.length; lIndex++) {
      const [lineIndexA , lineIndexB] = lineIndices.current[lIndex];
  
      const uA = new Vector3(...points.current[lineIndexA]);
      const uB = new Vector3(...points.current[lineIndexB]);
      const diff = new Vector3(0, 0, 0);

      diff.subVectors(uA, uB);

      distance += diff.length();
    }
    return distance;
  } 


  return {
    pointsRef,
    linesRef,
    points,
    normals,
    us,
    lineIndices,
    getRoadPointAtIndex,
    getRoadLineAtIndex,
    getLocalToWorldPos,
    getLocalToWorldRot,
    getUSpan,
  }
};

export default useRoadMesh2D;
