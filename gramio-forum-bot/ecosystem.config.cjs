module.exports = {
  name: "gramio-forum-bot",
  script: "src/index.ts",
  interpreter: "bun",
  interpreterArgs: ["--fetch-preconnect=https://api.telegram.org:443/"],
  env: {
    PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`
  }
}; 