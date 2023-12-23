import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web';

function ToggleSwitchUI() {
  const [isOn, toggleIsOn] = useState(false);

  const fade = useSpring({
    opacity: isOn ? 1: 0
  });

  return (
    <div>
      <animated.h1 style={fade}>On</animated.h1>
      <button onClick={() => {toggleIsOn(!isOn); console.log('to'); }}>Switch</button>
    </div>
  )
}

export default ToggleSwitchUI;
