import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { vec3 } from "@react-three/rapier";
import { STEER_SCALE, WHEEL_GRIP, WHEEL_GRIP_BACK, WHEEL_GRIP_FRONT, WHEEL_MASS } from "../utils/constants";
import useInputStore from "../stores/useInputStore";
import useWheelStore from "../stores/useWheelStore";


/**
 * @hook useSteering
 * 
 * Return the Forward, Up, Right, Axel
 *
 */
const useSteering = ({
  showRayDebug = true,
  index,
  body,
  forwardDir,
  upDir,
  rightDir,
  axelDir,
  axelRight,
  axelForward,
}) => {
  /**
   * Debug Arrow Ref
   */
  const arrowTF = useRef();

  /**
   * Stores
   */
  const inputAxis = useInputStore((state) => state.inputAxis);
  const wheels = useWheelStore((state) => state.wheels);
  const groundHits = useWheelStore(state => state.groundHits);

   /**
   * Steer Force Ref
   */
   const steerForce = useRef({
    origin: new Vector3(),
    direction: new Vector3()
  });


  /**
   * Methods
   */

  /**
   * Rotates the axelVector
   * 
   */
  const rotateAxelPlane = (inputValue) => {
    if(index > 1) {
      return;
    }

    const rotateAxis = upDir.current.clone().normalize();
    const rotateAngle = -inputValue * (Math.PI / 6);
    const rotatedAxel = rightDir.current.clone().applyAxisAngle(rotateAxis, rotateAngle);
    const rotatedForward = forwardDir.current.clone().applyAxisAngle(rotateAxis, rotateAngle);
    
    // Mutate Direction vectors on Axel Plane
    axelRight.current.copy(rotatedAxel);
    axelForward.current.copy(rotatedForward);
  }

  /**
   * Steering Force Logic 
   * 
   * @todo FIX IT! BUGGY
   * Called from parent on Raycast hit handler
   */
  const applySteerForce = (delta) => {
    steerForce.current = {
      origin: new Vector3(0, 0, 0),
      direction: new Vector3(0, 0, 0),
    };

    const wheelVel = groundHits?.[index].wheelVelocity;

    const wheelPos = vec3(wheels[index].current.translation());
    const steerDir = axelRight.current.clone();
    
    const tireWorldVel = wheelVel.clone();
    const tireGrip = index < 2 ? WHEEL_GRIP_FRONT: WHEEL_GRIP_BACK;

    const steerDotVel = steerDir.clone().dot(tireWorldVel);
    const gripVelChange = -steerDotVel * tireGrip;
    const gripAccel = gripVelChange / delta ;
    const gripForce = steerDir.clone().multiplyScalar(gripAccel * delta * WHEEL_MASS * STEER_SCALE);


    /**
     * Update steerForce Ref
     */
    steerForce.current = {
      origin: wheelPos,
      direction: gripForce,
    };

    // body.current.addForceAtPoint(gripForce, wheelPos, true);
    body.current.applyImpulseAtPoint(gripForce, wheelPos, true);
  }

  /**
   * Runs Every Frame to check if steering input if pressed
   * 
   * calls rotateAxelPlane when input is detected
   */
  const checkIfSteering = () => {
    if(Math.abs(inputAxis.y)) {
      rotateAxelPlane(inputAxis.y);

      return true;
    }

    return false;
  }

  /**
   * Arrow Helper for steer force
   */
  const updateSteerForceArrowHelper = () => {
    if(showRayDebug && steerForce?.current) {
      const {
        direction,
        origin,
      } = steerForce.current;

      if(arrowTF.current) {
        arrowTF.current.position.copy(origin);
        arrowTF.current.setDirection(direction);
        arrowTF.current.setColor('red');
        arrowTF.current.setLength(direction.length());
      }
    }
  };

  /**
   * useEffect & useFrame
   */
  useEffect(() => {
    console.log('useSteering');
    // Empty for now
  });

  useFrame(() => {
    // checkIfSteering();
  });


  return {
    arrowTF,
    checkIfSteering,
    applySteerForce,
    rotateAxelPlane,
    updateSteerForceArrowHelper,
  };
};

export default useSteering;
