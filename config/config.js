require("dotenv").config();

module.exports = {
  server: {
    url: process.env.url || "https://dev-api.neumobot.com",
    puerto: process.env.port || 8012,
    corsOrigins: process.env.corsOrigins || "*"
  },
  parametros: {
    nombre: process.env.modulo || "Gestion de formularios",
    databaseURL:
      process.env.databaseURL || "https://dev-neumomed.firebaseio.com",
    entorno: process.env.entorno || "local"
  },
  consultas: {},
  firebase: {
    type: process.env.type || "service_account",
    project_id: process.env.project_id || "dev-neumomed",
    private_key_id:
      process.env.private_key_id || "a9d9b9708ba16c29c5ae8936e31b29fbbfa09bc9",
    private_key: (
      process.env.private_key ||
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDF0YbThDGxYlky\numW6KLR0WXaCZAigwP/2cxuS0UVakQ2CRdZeneOuxyHxSdEi2J3Y3mINPr8/1yzx\nroBegCZXw+Np9G7DEUuddb/dbXW2KvkhFiQqetKWLuOuEIT0JXHjbv2oFKapP/Zr\nPtmJpps0I1pBy9erjEkq5B9qfz4HrJ8A4sxA4SFYCXWy/YXdN2+uZjrDGCdWzYCB\nca7+v03XsplD8QT1F9q3qzpphp/iZGU51ueogMhLm3+lbexRnJWT1b0Lg4tRFixr\nuxkFrPFIw0ElIJ8+Tmxx4xNslEyaQaL00lMWmeLUOu8yRmsk69ivldjP4gu2ksHg\n2WT7XEirAgMBAAECggEAE0HNkhCtNRCXEKukPzDljuqt8TfjaSFwqXaqKVWK9AE+\njenWL67HcoUQcP3tHdXK2UjzcEj6nYXealvrmNzOdBPDMyt9jtVuWtKSzhpGRRNo\n3jIwF3Hjxy/4Wm0MQaeALzznn4b8dGnKx2+TsLqRzaEKu8X9ZZtJ/M1pS4OTL8mP\n0/Br0+EkIjXK6DStRB0IgWGdVU7iDNOMtLoHW72kRcHpubW8oeJA+W0WZHF3PFTo\nZsZxmCmGrybj+cRJSPIVma0F8Sx+EDotVjOYAmAKGpTL3TL7HaYzZ/dA5z2BaJSo\nvTL4nwHh7tkzKUyGjHN2OUnW03UxPl8vPkdOj6KKrQKBgQDhXfwm2l6ekZdQ2YLu\nJRwHiycCUb+99vxofe10CppWIkFAUlQ8p9r5sR/Fjui/dllKZu6iVyyjSmOGTjdw\nWihb4OMctfgHZPfQQYFpSsHjjnM5Y2W13Vp2zyITYivVwQiazroDfK3kDKh9gvIg\nwgbraoC9pJJdQhxGB7pq63+nBQKBgQDgtPDw8kqgp8CKJGDRuUI7JWAit6bN5xXv\npGMrXEXDhY0VCcpFpuDO0i1hcC/gT06dZr1EY/nYne+ngoaHGV24I+6iu90EFztD\nCYuOVTPPdcfZnI1xQv4YjW1O76knzXurRLrRHeygU3exVr4d5oB6Bfso6EJdYjHe\noKXQlIrf7wKBgQC0Vvv+r0GGDCUUummuXZ23X5/AmGAiCDFlAFfyQsXL5S9n5Dmq\nK/vrUNSGx1vyUicThZix6aY7qLxJbe+pBUxEcYnroKWwbRhs2u5OrlbG3GfR5Xsv\nc8j/R7MR5b4EF6rmDkUFo1CXK5XskctlcT4ORjRtDPNekxeC5o5DHt4QbQKBgClo\njqIINEJox21tiL39Irxdhdq/9ygodn1j0LaT2XNPcBE5baHqP7E9QAmdr+TpGHaf\nES/CMK9/Y0N+JSZOQVwGmxo3/mGbmlsfLi17fAG2Fa7/T31YuBR0M3mBZq2kCy8j\nij2xAwMEfqEaeAxwhqp14bPHITuuNbxt5ECMrw7XAoGAYaHy18hA4u8bnSO7rcn9\nh5nKBInosNWIug4LWmSVa8Wgezb66p6qXVdyK2oQrxCtWY5eXbYd5yj4+pMopSMU\nk9dZbLCsiReb4s7yILqow2gKbc84RBjGKNcEajTNAB+93UfZJ78DMDQlxWw1LwWS\nNYioFSjcg9F7KBfXXWqdDz8=\n-----END PRIVATE KEY-----\n"
    ).replace(/\\n/g, "\n"),
    client_email:
      process.env.client_email ||
      "firebase-adminsdk-xwy3p@dev-neumomed.iam.gserviceaccount.com",
    client_id: process.env.client_id || "103061484983772206361",
    auth_uri:
      process.env.auth_uri || "https://accounts.google.com/o/oauth2/auth",
    token_uri: process.env.token_uri || "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:
      process.env.auth_provider_x509_cert_url ||
      "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      process.env.client_x509_cert_url ||
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xwy3p%40dev-neumomed.iam.gserviceaccount.com"
  },
  storage: {
    project: process.env.project_id || "dev-neumomed",
    bucketFormularios:
      process.env.bucketFormularios || "gestion_formularios_dev",
    fileStorage: process.env.fileStorage || "google.json"
  }
};
