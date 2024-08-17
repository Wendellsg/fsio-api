/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
console.log('Loaded environment variables:', process.env);
const { execSync } = require('child_process');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Variáveis de ambiente carregadas
console.log(`IMAGE_NAME=${process.env.IMAGE_NAME}`);
console.log(`IMAGE_VERSION=${process.env.IMAGE_VERSION}`);
console.log(`DOCKERFILE_PATH=${process.env.DOCKERFILE_PATH}`);
console.log(`REGISTRY_URL=${process.env.REGISTRY_URL}`);
console.log(`REGISTRY_USER=${process.env.REGISTRY_USER}`);
console.log(`DEPLOY_WEBHOOK_URL=${process.env.DEPLOY_WEBHOOK_URL}`);
// (Não ecoar senhas em produção)
console.log(`REGISTRY_PASSWORD=${process.env.REGISTRY_PASSWORD}`);

// Build da imagem Docker
console.log('Building Docker image...');
execSync(
  `docker build -t "${process.env.IMAGE_NAME}:${process.env.IMAGE_VERSION}" -f "${process.env.DOCKERFILE_PATH}/Dockerfile" ${process.env.DOCKERFILE_PATH}`,
  { stdio: 'inherit' },
);

// Login no registry
console.log('Logging into container registry...');
execSync(
  `docker login ${process.env.REGISTRY_URL} -u ${process.env.REGISTRY_USER} -p ${process.env.REGISTRY_PASSWORD}`,
  { stdio: 'inherit' },
);

// Tag da imagem com o registry
console.log('Tagging image for the registry...');
execSync(
  `docker tag "${process.env.IMAGE_NAME}:${process.env.IMAGE_VERSION}" "${process.env.REGISTRY_URL}/${process.env.IMAGE_NAME}:${process.env.IMAGE_VERSION}"`,
  { stdio: 'inherit' },
);

// Push da imagem para o registry
console.log('Pushing image to the registry...');
execSync(
  `docker push "${process.env.REGISTRY_URL}/${process.env.IMAGE_NAME}:${process.env.IMAGE_VERSION}"`,
  { stdio: 'inherit' },
);

// Envia uma solicitação POST para a API usando curl
console.log('Sending deployment webhook...');
fetch(process.env.DEPLOY_WEBHOOK_URL, {
  method: 'POST',
})
  .then(() => {
    console.log('Deployment complete!');
  })
  .catch((error) => {
    console.error('Error sending deployment webhook:', error);
  });
