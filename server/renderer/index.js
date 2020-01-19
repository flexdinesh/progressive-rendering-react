import path from "path";
import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";

import CONSTANTS from "../constants";
import { getSectionOneText, getSectionTwoText } from "../api/oyster-text";
import {
  renderProgressiveComponentToScript,
  createStoreScript,
  createStoreAssignerScript
} from "./helpers";
import App from "../../app/src/components/App";
import { getProgressiveComponent } from "../../app/src/components/ProgressiveComponent";
import TextSection from "../../app/src/components/TextSection";

// express server route callback
const serverRenderer = async (req, res, next) => {
  const renderedAppHTMLStr = ReactDOMServer.renderToString(
    <App store={{ RENDER_FROM: "SERVER_PLACEHOLDER" }} />
  );

  global.GLOBAL_STORE = {};

  fs.readFile(
    path.join(CONSTANTS.APP_BUILD_DIR, "index.html"),
    "utf8",
    async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred!!");
      }

      const firstChunk = data.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedAppHTMLStr}</div>`
      );

      res.status(200);
      res.type("text/html; charset=utf-8");

      res.write(firstChunk);

      res.write(createStoreScript("GLOBAL_STORE"));

      global.GLOBAL_STORE.sectionOneText = await getSectionOneText();
      res.write(
        createStoreAssignerScript(
          "GLOBAL_STORE",
          "sectionOneText",
          global.GLOBAL_STORE.sectionOneText
        )
      );
      const ProgressiveComponentPCOne = getProgressiveComponent({
        RENDER_FROM: "SERVER",
        serverRenderId: "PCOne"
      });
      const PCOneScript = renderProgressiveComponentToScript(
        "PCOne",
        <ProgressiveComponentPCOne
          serverRenderId={"PCOne"}
          RENDER_FROM="SERVER"
        >
          <TextSection
            store={global.GLOBAL_STORE}
            storeKey={"sectionOneText"}
            text={global.GLOBAL_STORE.sectionOneText}
          />
        </ProgressiveComponentPCOne>
      );
      res.write(PCOneScript);

      global.GLOBAL_STORE.sectionTwoText = await getSectionTwoText();
      res.write(
        createStoreAssignerScript(
          "GLOBAL_STORE",
          "sectionTwoText",
          global.GLOBAL_STORE.sectionTwoText
        )
      );

      const ProgressiveComponentPCTwo = getProgressiveComponent({
        RENDER_FROM: "SERVER",
        serverRenderId: "PCTwo"
      });
      const PCTwoScript = renderProgressiveComponentToScript(
        "PCTwo",
        <ProgressiveComponentPCTwo
          serverRenderId={"PCTwo"}
          RENDER_FROM="SERVER"
        >
          <TextSection
            store={global.GLOBAL_STORE}
            storeKey={"sectionTwoText"}
            text={global.GLOBAL_STORE.sectionTwoText}
          />
        </ProgressiveComponentPCTwo>
      );
      res.write(PCTwoScript);
      res.end();
    }
  );
};

export default serverRenderer;
