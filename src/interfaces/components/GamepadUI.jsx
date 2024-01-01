
import { useEffect, useRef } from "react";
import useLevelEditorStore from "../../editor/stores/useLevelEditorStore";
import { addEffect, useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/web"
import { TERRAIN_MATERIALS } from "../../editor/utils/constants";
import actorMap from "../../editor/mappings/actors";
import useInputStore from "../../vehicles/wheel/stores/useInputStore";
import { INPUT_DEADZONE, INPUT_TYPE_GAMEPAD, INPUT_TYPE_KEYBOARD } from "../../vehicles/wheel/utils/constants";
import GamepadIcon from "../icons/GampeIcon";

function GamepadUI() {
  /**
   * Refs
   */
  const uiRef = useRef();
  const buttonGroupRef = useRef();
  const gamepadIconRef = useRef();

  const gamepadIndexRef = useRef(null);
  
  const inputType = useInputStore((state) => state.inputType);
  const setInputType = useInputStore((state) => state.setInputType);
  const updateInputX = useInputStore((state) => state.updateInputX);
  const updateInputY = useInputStore((state) => state.updateInputY);
  const updateCameraInputX = useInputStore((state) => state.updateCameraInputX);
  const updateCameraInputY = useInputStore((state) => state.updateCameraInputY);
  

  const showObjects = inputType === INPUT_TYPE_GAMEPAD;

  /**
   * Animation Springs
   */
  const fadeIn = useSpring({
    opacity: showObjects ? 1 : 0,
  });

  const jumpIn = useSpring({
    transform: showObjects ? 'scaleY(100%)': 'scaleY(0%)',
    config: {
      friction: 20,
      tension: 500,
    },
  });

  /**
   * Event handler
   */
  const registerEventHandler = () => {
    window.addEventListener('gamepadconnected', (e) => {
      console.log('Connected gamepad', e.gamepad);
      setInputType(INPUT_TYPE_GAMEPAD);

      gamepadIndexRef.current = e.gamepad.index;
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      console.log('Disconnected  gamepad', e.gamepad);
      setInputType(INPUT_TYPE_KEYBOARD)
    });
  };
  
  const moveStickIcons = (elementId, stickIndex, leftRightAxis, upDownAxis) => {
    const multiplier = 25;
    const hAxisFiltered = Math.abs(leftRightAxis) > INPUT_DEADZONE ? leftRightAxis: 0;
    const VAxisFiltered =  Math.abs(upDownAxis) > INPUT_DEADZONE ? upDownAxis: 0;
    const stickLeftRight = hAxisFiltered * multiplier;
    const stickupDown = VAxisFiltered * multiplier;

    const stickElement = document.getElementById(elementId);
    const x = Number(stickElement.dataset.originalXPosition);
    const y = Number(stickElement.dataset.originalYPosition);

    // console.log(stickIndex, leftRightAxis, upDownAxis);

    stickElement.setAttribute('cx', x + stickLeftRight);
    stickElement.setAttribute('cy', y + stickupDown);

    if(stickIndex === 0) {
      updateInputY(hAxisFiltered);
      // console.log('axis input', leftRightAxis);
    } else {
      updateCameraInputX(hAxisFiltered);
      updateCameraInputY(VAxisFiltered);
      // console.log('axis camera', leftRightAxis);
    }
  };

  const handleGamepadSticks = (axes) => {
    const activeAxes = axes.filter((a) => Math.abs(a) > INPUT_DEADZONE);

    if(activeAxes.length) {
      if(inputType !== INPUT_TYPE_GAMEPAD) {
        setInputType(INPUT_TYPE_GAMEPAD);
      }
    }

    moveStickIcons('controller-b10', 0, axes[0], axes[1]);
    moveStickIcons('controller-b11', 1, axes[2], axes[3]);
  };

  const handleGamepadButtons = (buttons) => {
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const buttonElement = document.getElementById(`controller-b${i}`);
      const selectedBtnClass = 'selected-button';

      if(buttonElement) {
        if(button.value > 0) {
          buttonElement.classList.add(selectedBtnClass);
          buttonElement.style.filter = `contrast(${button.value * 150}%)`;
        } else {
          buttonElement.classList.remove(selectedBtnClass);
          buttonElement.style.filter = `contrast(100%)`;
        }
      }
    }

    const pressed = buttons.filter((b) => b.value);
    
    if(pressed.length) {
      if(inputType !== INPUT_TYPE_GAMEPAD) {
        setInputType(INPUT_TYPE_GAMEPAD);
      }
    }

    const lTriggerValue = buttons[6].value;
    const rTriggerValue = buttons[7].value;
    const fTriggerValue = rTriggerValue - lTriggerValue;

    updateInputX(fTriggerValue);
  };


  const updateGamePadInputs = () => {
    if(gamepadIndexRef.current !== null) {
      const gamepad = navigator.getGamepads()[gamepadIndexRef.current];

      handleGamepadSticks(gamepad.axes);
      handleGamepadButtons(gamepad.buttons);
    }
  };


  useEffect(() => {
    
    registerEventHandler();

    addEffect(() => {
      updateGamePadInputs();
    });

  }, []);

  

  return (
    <animated.div ref={uiRef} style={fadeIn} className="grid-options">
      <animated.div ref={buttonGroupRef} style={jumpIn} className="gamepad-wrapper">
        <div className="gamepad" id="gamepad">
          <GamepadIcon ref={gamepadIconRef} />
        </div>
      </animated.div>
    </animated.div>
  );
}

export default GamepadUI;
