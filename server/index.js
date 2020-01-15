import path from "path";
import fs from "fs";

import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";

import App from "../app/src/components/App";
import ProgressiveSection from "../app/src/components/ProgressiveSection";

const PORT = 8080;
const app = express();
const router = express.Router();

const waitMS = async function(ms = 1000) {
  return await new Promise(resolve => {
    let waitT = setTimeout(() => {
      clearTimeout(waitT);
      resolve();
    }, ms);
  });
};

// express server route callback
const serverRenderer = async (req, res, next) => {
  const renderedAppHTMLStr = ReactDOMServer.renderToString(<App />);
  const globalStore = {};

  fs.readFile(
    path.resolve("../app/dist/index.html"),
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

      await waitMS(2000);
      globalStore.sectionOneText = "The whole world is my oyester";

      const PSOne = ReactDOMServer.renderToStaticMarkup(
        <ProgressiveSection
          serverRenderId={"PSOne"}
          text={globalStore.sectionOneText}
        />
      );

      res.write(`
    <script>
      document.querySelector("#PSOne").outerHTML = '${PSOne}';
    </script>
    `);

      await waitMS(2000);
      globalStore.sectionTwoText =
        "And I will render it progressively from my server";

      const PSTwo = ReactDOMServer.renderToStaticMarkup(
        <ProgressiveSection
          serverRenderId={"PSTwo"}
          text={globalStore.sectionTwoText}
        />
      );

      res.write(`
    <script>
      document.querySelector("#PSTwo").outerHTML = '${PSTwo}';
    </script>
    `);

      res.write(
        `<script>
          window.GLOBAL_STORE = ${JSON.stringify(globalStore)};
        </script>`
      );

      res.end();
    }
  );
};

router.use("^/$", serverRenderer);
router.use(
  "/dist",
  express.static(path.join(__dirname, "../../app/dist"), {
    maxAge: "30d"
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
