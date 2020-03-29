const path = require("path");
const babel = require("rollup-plugin-babel");
const replace = require("rollup-plugin-replace");

const globals = { react: "React" };

const cjs = [
  {
    input: "lib/index.js",
    output: {
      file: `dist/index.js`,
      sourcemap: true,
      format: "cjs",
      esModule: false
    },
    external: Object.keys(globals),
    plugins: [
      babel({ exclude: /node_modules/ }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.BUILD_FORMAT": JSON.stringify("cjs")
      })
    ],
    globals
  }
];

module.exports = cjs;
