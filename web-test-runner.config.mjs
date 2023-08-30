import { esbuildPlugin } from "@web/dev-server-esbuild"

export default {
  concurrency: 10,
  nodeResolve: true,
  watch      : true,
  puppeteer  : false,
  playwright : false,
  files  : [ '*.test.ts' ],
  plugins: [ esbuildPlugin( { ts: true } ) ],
  testRunnerHtml: testFramework =>
    `<html>
      <body>
        <script>window.process = { env: { NODE_ENV: "development" } }</script>
        <script type="module" src="${ testFramework }"></script>
      </body>
    </html>`,
}
