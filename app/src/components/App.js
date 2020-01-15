import React from "react";
import logo from "../images/logo.svg";
import ProgressiveSection from "./ProgressiveSection";
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
      <ProgressiveSection
        serverRenderId={"PSOne"}
        text={store.sectionOneText}
      />
      <ProgressiveSection
        serverRenderId={"PSTwo"}
        text={store.sectionTwoText}
      />
    </div>
  );
}

export default App;
