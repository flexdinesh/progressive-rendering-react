const express = require("express");
const serverRenderer = require("./renderer").default;
const CONSTANTS = require("./constants");

const PORT = 8080;
const app = express();
const router = express.Router();

router.use("^/$", serverRenderer);
router.use(
  "/dist",
  express.static(CONSTANTS.APP_BUILD_DIR, {
    maxAge: "30d"
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
