import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import Sage from "./models/Sage";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Vector3 } from "three";


import useGame from "./stores/useGame";
import useAnimState from "./stores/useAnimState";

const JUMP_FORCE = 0.5;
const MOVEMENT_SPEED = 0.8;
const MAX_VEL = 2;
const RUN_VEL = 1.5;
const WALK_VEL = 0.1;

function CharacterController() {
  const body = useRef();
  const model = useRef();
  const meshGroup = useRef();
  const [ subscribeKeys, getKeys ] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const [smoothCameraPosition] = useState(() => new Vector3(10, 10 , 10));
  const [smoothCameraTarget] = useState(() => new Vector3());

  // Anim Store
  const { animState, setAnimState } = useAnimState((state) => ({
    animState: state.animState,
    setAnimState: state.setAnimState
  }));

  // Game Store
  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);

  const jump = () => {
    const jumpStrength = 0.5;
    
    const origin = body.current.translation();
    origin.y -= 0.31;

    const direction = { x: 0, y: -1, z:0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if(hit.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: jumpStrength, z: 0});
    }
  }

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0});
    body.current.setLinvel({ x: 0, y: 1, z: 0});
    body.current.setAngvel({ x: 0, y: 1, z: 0});
  }

  useEffect(() => {
    const unsubscribeReset= useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if(value === 'ready') {
          reset();
        }
      }
    );

    const unsubscribeJump =  subscribeKeys(
      // Selector
      (state) => state.jump,

      // Listener
      (value) => {
        if(value) {
          jump();
        }
      }
    );

    const unsubscribeAny =  subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const {
      forward,
      backward,
      leftward,
      rightward,
    } = getKeys();

    const impulse = { x: 0, y: 0, z: 0};
    let changeRotation = false;

    const impulseStrength = MOVEMENT_SPEED * delta;
    
    const linvel = body.current.linvel();

    if(forward && linvel.z >  -MAX_VEL) {
      impulse.z -= impulseStrength;
    }
    
    if(backward && linvel.z <  MAX_VEL) {
      impulse.z += impulseStrength;
      changeRotation = true;
    }

    if(leftward && linvel.x >  -MAX_VEL) {
      impulse.x -= impulseStrength;
      changeRotation = true;
    }

    if(rightward && linvel.x <  MAX_VEL) {
      impulse.x += impulseStrength;
      changeRotation = true;
    }

    body.current.applyImpulse(impulse, true);

    if(Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL) {
      if(animState !== 'Run') {
        setAnimState('Run');
      }

    } else if(Math.abs(linvel.x) > WALK_VEL || Math.abs(linvel.z) > WALK_VEL) {
      if(animState !== 'Walk') {
        setAnimState('Walk');
      }

    } else {
      if(animState !== 'Idle') {
        setAnimState('Idle');
      }
    }

    if(changeRotation) {
      const angle = Math.atan2(-linvel.x, -linvel.z)
      meshGroup.current.rotation.y = angle;
    }

    /**
     * Get Body Position
     */
    const bodyPosition = body.current.translation();

    // /**
    //  * Camera
    //  */
    // const cameraPosition = new Vector3();
    // cameraPosition.copy(bodyPosition);
    // cameraPosition.z += 2.25;
    // cameraPosition.y += 0.65;

    // const cameraTarget = new Vector3();
    // cameraTarget.copy(bodyPosition);
    // cameraTarget.y += 0.25;

    // const lerpT = 1 - Math.pow(0.001, delta);

    // smoothCameraPosition.lerp(cameraPosition, lerpT);
    // smoothCameraTarget.lerp(cameraTarget, lerpT);

    // state.camera.position.copy(smoothCameraPosition);
    // state.camera.lookAt(smoothCameraTarget);

    /**
     * Game Phases
     */
    if(bodyPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }

    if(bodyPosition.y < -4) {
      restart();
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders={false}
        enabledRotations={[false, false, false]}
        restitution={0.6}
        friction={1}
      >
        <CapsuleCollider args={[0.1, 0.2]}  position={[0, 1.2, 0]}>
          <group ref={meshGroup}>
            <Sage ref={model} position={[0, -0.2, 0]}  rotation={[0, Math.PI , 0]} />
          </group>
        </CapsuleCollider>
      </RigidBody>
    </>
  )
}

export default CharacterController;
