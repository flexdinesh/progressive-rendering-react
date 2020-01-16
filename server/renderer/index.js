import path from "path";
import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";

import CONSTANTS from "../constants";
import { getSectionOneText, getSectionTwoText } from "../api/oyster-text";
import { renderProgressiveContentToMarkup, createStoreScript } from "./helpers";
import App from "../../app/src/components/App";
import ProgressiveSection from "../../app/src/components/ProgressiveSection";

// express server route callback
const serverRenderer = async (req, res, next) => {
  const renderedAppHTMLStr = ReactDOMServer.renderToString(<App />);
  const globalStore = {};

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
        `<div id="root">${renderedAppHTMLStr}</div>
          `
      );

      res.status(200);
      res.type("text/html; charset=utf-8");

      res.write(firstChunk);

      globalStore.sectionOneText = await getSectionOneText();
      const PSOneScript = renderProgressiveContentToMarkup(
        "PSOne",
        <ProgressiveSection
          serverRenderId={"PSOne"}
          text={globalStore.sectionOneText}
        />
      );
      res.write(PSOneScript);

      globalStore.sectionTwoText = await getSectionTwoText();
      const PSTwoScript = renderProgressiveContentToMarkup(
        "PSTwo",
        <ProgressiveSection
          serverRenderId={"PSTwo"}
          text={globalStore.sectionTwoText}
        />
      );
      res.write(PSTwoScript);
      res.write(createStoreScript(globalStore));
      res.end();
    }
  );
};

export default serverRenderer;
