const { Storage } = require("@google-cloud/storage");
const config = require("../config/config");

const storageClient = new Storage({
  projectId: config.firebase.project_id,
  credentials: {
    client_email: config.firebase.client_email,
    private_key: config.firebase.private_key
  }
});
const bucket = storageClient.bucket(config.storage.bucketFormularios);

module.exports = {
  storageClient,
  bucket
};
