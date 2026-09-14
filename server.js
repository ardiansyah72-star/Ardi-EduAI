const app = require("./server/server.js");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log("");
    console.log("🚀 ARDI EDUAI");
    console.log(`🌐 http://localhost:${PORT}`);
  });
}

module.exports = app;