import React, { useState, useRef, useEffect } from "react";
import { Portal } from "react-portal";
import { useSpring, animated } from "react-spring";
import useDimensions from "react-use-dimensions";

import "./styles.css";

const states = {
  CLOSED: "closed",
  OPENING: "opening",
  OPEN: "open",
  CLOSING: "closing"
};

const stackingPriority = {
  [states.CLOSED]: 1001,
  [states.CLOSING]: 1002,
  [states.OPENING]: 1003,
  [states.OPEN]: 10004
};

const fullScreenPosition = {
  left: 0,
  width: "calc(0px + 100vw)",
  top: 0,
  height: "calc(0px + 100vh)"
};

const getPositionFromBoundingRect = boundingRect => {
  return {
    left: boundingRect.top,
    width: `calc(${boundingRect.width}px + 0vw)`,
    top: boundingRect.left,
    height: `calc(${boundingRect.height}px + 0vh)`
  };
};

function Fullscreen(props) {
  let [status, setStatus] = useState(states.CLOSED);

  const [ref, dimensions] = useDimensions();

  const showExpanded = [states.OPENING, states.OPEN, states.CLOSING].includes(
    status
  );

  const originalPosition = getPositionFromBoundingRect(dimensions);

  const open = () => {
    setStatus(states.OPENING);
  };

  const close = () => {
    setStatus(states.CLOSING);
  };

  const handleRest = () => {
    if (status === states.OPENING) {
      setStatus(states.OPEN);
    } else if (status === states.CLOSING) {
      setStatus(states.CLOSED);
    }
  };

  // Maintain document flow
  const closedChildren = props.children({ open, close, status: states.CLOSED });
  const children = props.children({ open, close, status });

  return (
    <div
      ref={ref}
      style={{
        opacity: status === states.CLOSED ? 1 : 0,
        ...props.style
      }}
      className={props.className}
    >
      {closedChildren}
      <Portal>
        {showExpanded && (
          <AnimatedDiv
            style={{
              position: "fixed",
              zIndex: stackingPriority[status]
            }}
            from={
              [states.OPENING, states.OPEN].includes(status)
                ? originalPosition
                : fullScreenPosition
            }
            to={
              [states.CLOSING, states.CLOSED].includes(status)
                ? originalPosition
                : fullScreenPosition
            }
            onRest={handleRest}
          >
            {children}
          </AnimatedDiv>
        )}
      </Portal>
    </div>
  );
}

const AnimatedDiv = props => {
  const animation = useSpring({
    from: props.from,
    to: props.to,
    onRest: props.onRest,
    config: { mass: 1, tension: 350, friction: 32, clamp: true }
  });

  return (
    <animated.div style={{ ...props.style, ...animation }}>
      {props.children}
    </animated.div>
  );
};

export { states }

export default Fullscreen
