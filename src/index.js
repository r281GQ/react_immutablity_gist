import React, { useReducer, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function usePropsRef(props) {
  const propsRef = useRef(props);

  useEffect(() => {
    propsRef.current = props;
  });

  return propsRef;
}

function GrandChild(props) {
  const propsRef = usePropsRef(props);

  function eventHandler(event) {
    console.log(propsRef);
  }

  useEffect(() => {
    document.addEventListener("scroll", eventHandler);

    return () => {
      document.removeEventListener("scroll", eventHandler);
    };
  }, []);

  return (
    <div>
      This is the grand child and it will not get updated
      <div>{props.number || 0}</div>
    </div>
  );
}

function Child(props) {
  function eventHandler(event) {
    // console.log(props);
  }

  useEffect(
    () => {
      document.addEventListener("scroll", eventHandler);

      return () => {
        document.removeEventListener("scroll", eventHandler);
      };
    },
    [props.parentState]
  );

  return (
    <>
      This is the child element with the number coming from the parent :{" "}
      {props.parentState.number}
      <div>
        <button
          onClick={() => {
            props.parentState.number = props.parentState.number + 1;
            console.log(props);
          }}
        >
          clicking on me will increment the number using reference and
          mutability
        </button>
      </div>
      <GrandChild number={props.parentState.number} />
    </>
  );
}

function App() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      if (action.type === "inc") {
        return { ...state, number: +state.number + 1 };
      }

      if (action.type === "dec") {
        return {
          ...state,
          number: state.number - 1
        };
      }

      return state;
    },
    { number: 5 }
  );

  return (
    <div style={{ height: 400 }}>
      The current number in state when it got rendered was : {state.number}
      <div style={{ marginTop: 30 }}>
        <button onClick={() => console.log(state)}>
          The underlying state is updated but not reflected in the app
        </button>
        <button onClick={() => dispatch({ type: "inc" })}>
          That is the normal increment cycle
        </button>
        <div style={{ marginTop: 30 }}>
          <Child parentState={state} />
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
