const app = require('./app');

PORT = process.env.PORT ? process.env.PORT : 9090;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`listening on port ${PORT}`);
});