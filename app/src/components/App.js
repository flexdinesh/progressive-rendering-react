import React from "react";
import { getProgressiveComponent } from "./ProgressiveComponent";
import Nav from "./DEVAlike/Nav";
import Main from "./DEVAlike/Main";
import Post from "./DEVAlike/Post";
// import Listings from "./DEVAlike/Listings";
// import TagFeed from "./DEVAlike/TagFeed";
import LeftNav from "./DEVAlike/LeftNav";
// import Sponsors from "./DEVAlike/Sponsors";
import "./App.css";

let ProgressiveLeftSection;
let ProgressiveRightSection;

function App({ store: defaultStore }) {
  const [store, setStore] = React.useState({ ...defaultStore });

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--card-bg",
      "rgba(0, 255, 0, 0.1)"
    );
    document.documentElement.style.setProperty(
      "--card-bg-p",
      "rgba(0, 255, 0, 0.3)"
    );
    document.documentElement.style.setProperty(
      "--card-bg-s",
      "rgba(0, 255, 0, 0.1)"
    );
    // window.setTimeout(() => {
    //   window.clearInterval(window.timerId);
    // }, 0);
    // setStore({...store});
    // setHydrated(true);
    setStore({ ...store, hydrated: true });
    window.GLOBAL_STORE.hydrated = true;
  }, []);

  if (!ProgressiveLeftSection) {
    ProgressiveLeftSection = getProgressiveComponent({
      renderfrom: store.renderfrom,
      serverrenderid: "ProgressiveLS"
    });
  }

  if (!ProgressiveRightSection) {
    ProgressiveRightSection = getProgressiveComponent({
      renderfrom: store.renderfrom,
      serverrenderid: "ProgressiveRS"
    });
  }

  return (
    <div className={"App"}>
      <Nav />
      <Main>
        <div>
          {(store.renderMode === "SSR" || store.renderMode === "CSR") && (
            <LeftNav store={store} />
          )}
          {store.renderMode === "PSSR" && !store.hydrated && (
            <React.Suspense
              fallback={
                <div>
                  <div id={"ProgressiveLS"}>placeholder fallback</div>
                </div>
              }
            >
              <ProgressiveLeftSection
                serverrenderid={"ProgressiveLS"}
                renderfrom={store.renderfrom}
              >
                <LeftNav store={store} />
              </ProgressiveLeftSection>
            </React.Suspense>
          )}
          {store.renderMode === "PSSR" && store.hydrated && (
            <React.Fragment>
              <LeftNav store={store} />
            </React.Fragment>
          )}
        </div>
        <div>
          <Post />
          <Post />
        </div>
        <div>
          {(store.renderMode === "SSR" || store.renderMode === "CSR") && (
            <React.Fragment>
              <LeftNav store={store} />
            </React.Fragment>
          )}
          {store.renderMode === "PSSR" && !store.hydrated && (
            <React.Suspense
              fallback={
                <div>
                  <div id={"ProgressiveRS"}>placeholder fallback</div>
                </div>
              }
            >
              <ProgressiveRightSection
                serverrenderid={"ProgressiveRS"}
                renderfrom={store.renderfrom}
              >
                <LeftNav store={store} />
              </ProgressiveRightSection>
            </React.Suspense>
          )}
          {store.renderMode === "PSSR" && store.hydrated && (
            <React.Fragment>
              <LeftNav store={store} />
            </React.Fragment>
          )}
        </div>
      </Main>
    </div>
  );
}

export default App;
