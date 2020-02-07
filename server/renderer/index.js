import path from "path";
import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";

import CONSTANTS from "../constants";
import { getSectionOneText, getSectionTwoText } from "../api/oyster-text";
import {
  renderProgressiveComponentToScript,
  createStoreAssignerScript
} from "./helpers";
import App from "../../app/src/components/App";
import LeftNav from "../../app/src/components/DEVAlike/LeftNav";
import { getProgressiveComponent } from "../../app/src/components/ProgressiveComponent";

const clientDevOnly = false;
// express server route callback
const serverRenderer = async (req, res, next) => {
  // "CSR", "SSR", "PSSR"
  let RENDER_MODE = "CSR";
  let LATENCY_FACTOR = 1;
  const modeInQuery = req.query.mode;
  const latencyInQuery = req.query.latency;
  if (["CSR", "SSR", "PSSR"].includes(modeInQuery)) {
    RENDER_MODE = req.query.mode;
  }
  if (latencyInQuery > 0) {
    LATENCY_FACTOR = latencyInQuery;
  }
  console.log({ RENDER_MODE, LATENCY_FACTOR });

  global.GLOBAL_STORE = {
    renderfrom: "SERVER_PLACEHOLDER",
    renderMode: RENDER_MODE,
    clientDevOnly,
    hydrated: false,
    LeftNavContent: false,
    RightNavContent: false
  };

  const renderedAppHTMLStr = ReactDOMServer.renderToString(
    <App store={global.GLOBAL_STORE} />
  );

  fs.readFile(
    path.join(CONSTANTS.APP_BUILD_DIR, "index.html"),
    "utf8",
    async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred!!");
      }

      res.status(200);
      res.type("text/html; charset=utf-8");
      const indexHTML = data;

      if (RENDER_MODE === "CSR") {
        const firstChunk = indexHTML.replace(
          '<script id="server-injectable"></script>',
          `<script>window.clientDevOnly=false;window.renderMode="CSR";window.GLOBAL_STORE={};</script>`
        );

        res.write(firstChunk);
        // res.write(
        //   `<script>window.setTimeout(() => {
        //     window.clearInterval(window.timerId);
        //   }, 0);
        //   </script>`
        // );
        return res.end();
      } else if (RENDER_MODE === "SSR") {
        let firstChunk = indexHTML.replace(
          '<script id="server-injectable"></script>',
          `<script>window.renderMode="SSR";window.GLOBAL_STORE={};</script>`
        );
        firstChunk = firstChunk.replace(
          '<div id="root"></div>',
          `<div id="root">${renderedAppHTMLStr}</div>`
        );

        res.write(firstChunk);
        // res.write(
        //   `<script>window.setTimeout(() => {
        //     window.clearInterval(window.timerId);
        //   }, 0);
        //   </script>`
        // );
        return res.end();
      }
      global.GLOBAL_STORE.renderfrom = "SERVER";

      let firstChunk = indexHTML.replace(
        '<script id="server-injectable"></script>',
        `<script>window.renderMode="PSSR";window.GLOBAL_STORE={};</script>`
      );
      firstChunk = firstChunk.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedAppHTMLStr}</div>`
      );

      res.write(firstChunk);

      global.GLOBAL_STORE.sectionOneText = await getSectionOneText(
        LATENCY_FACTOR
      );
      res.write(
        createStoreAssignerScript("GLOBAL_STORE", "LeftNavContent", true)
      );

      const ProgressiveLeftSection = getProgressiveComponent({
        renderfrom: "SERVER",
        serverrenderid: "ProgressiveLS"
      });
      const ProgressiveLeftSectionScript = renderProgressiveComponentToScript(
        "ProgressiveLS",
        <ProgressiveLeftSection serverrenderid={"ProgressiveLS"}>
          <LeftNav store={global.GLOBAL_STORE} />
        </ProgressiveLeftSection>
      );
      res.write(ProgressiveLeftSectionScript);

      global.GLOBAL_STORE.sectionTwoText = await getSectionTwoText(
        LATENCY_FACTOR
      );
      res.write(
        createStoreAssignerScript("GLOBAL_STORE", "RightNavContent", true)
      );

      const ProgressiveRightSection = getProgressiveComponent({
        renderfrom: "SERVER",
        serverrenderid: "ProgressiveRS"
      });
      const ProgressiveRightSectionScript = renderProgressiveComponentToScript(
        "ProgressiveRS",
        <ProgressiveRightSection
          serverrenderid={"ProgressiveRS"}
          renderfrom="SERVER"
        >
          <LeftNav store={global.GLOBAL_STORE} />
        </ProgressiveRightSection>
      );
      res.write(ProgressiveRightSectionScript);
      
      res.end();
    }
  );
};

export default serverRenderer;
