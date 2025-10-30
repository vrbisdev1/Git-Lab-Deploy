const express = require('express');
const app = express();
const cors = require('cors');

const { exec } = require('child_process');

const dns = require('dns');

app.use(cors({ origin: "https://sslab-webappvrt1.azurewebsites.net" }));

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();
const vaultName = process.env.KEYVAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

async function getAdminPassword() {
  const secret = await client.getSecret("ADMIN-PASSWORD");
  return secret.value;
}

app.get('/admin', async (req, res) => {
  const auth = req.headers['authorization'];

  if (!auth || !auth.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", "Basic realm=admin");
    return res.status(401).send("Authentication required");
  }

  const base64 = auth.split(" ")[1];
  const [user, pass] = Buffer.from(base64, "base64").toString().split(":");

  const ADMIN_PASSWORD = await getAdminPassword();
  if (user === "admin" && pass === ADMIN_PASSWORD) {
    res.send("Welcome admin");
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get('/', (req, res) => {
  res.send('App is running securely 🎉');
});
app.listen(process.env.PORT || 8080);
