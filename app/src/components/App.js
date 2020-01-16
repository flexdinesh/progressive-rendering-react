import React from "react";
import logo from "../images/logo.svg";
import ProgressiveComponent from "./ProgressiveComponent";
import TextSection from "./TextSection";
import "./App.css";

function App({ store = {} }) {
  const [text, setText] = React.useState("This is server rendered content");
  const [isMounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setText("Client-side hydration complete");
    setMounted(true);
  }, []);

  return (
    <div className={"App" + (isMounted ? " flash" : "")}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>This React app is progressively rendered from the server.</p>
        <code>{text}</code>
      </header>
      <ProgressiveComponent serverRenderId={"PCOne"}>
        <TextSection text={store.sectionOneText} />
      </ProgressiveComponent>
      <ProgressiveComponent serverRenderId={"PCTwo"}>
        <TextSection text={store.sectionTwoText} />
      </ProgressiveComponent>
    </div>
  );
}

export default App;
