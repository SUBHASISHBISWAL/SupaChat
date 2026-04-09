# CI/CD Pipeline

SupaChat utilizes **GitHub Actions** for Continuous Integration and Continuous Deployment (CI/CD). The primary workflow relies on `.github/workflows/deploy.yml`.

## Pipeline Flow Overview

Every push to the `main` branch triggers the deployment workflow:

1. **Checkout:** Clones the repository codebase.
2. **Setup:** Installs Docker/Buildx environments.
3. **Environment Injection:** Loads AWS deployment credentials and configures SSH secrets securely via GitHub Secrets.
4. **Copy & Sync:** Uses SCP or rsync to map the Git tree to the remote EC2 instance via SSH.
5. **App Deployment:** Logs into the EC2 instance remotely to trigger a `docker compose pull` and `docker compose up -d` against the `docker-compose.yml`.

*(Note: The `monitoring/` directory and `docker-compose.monitoring.yml` should be synced alongside the main artifacts in the SSH deployment.)*

## Required GitHub Secrets

To ensure the pipeline passes correctly, the repository must be configured with these GitHub Actions Secrets:

- `EC2_HOST`: The IP Address of your EC2 Server.
- `EC2_USER`: The default user to log in via SSH (e.g., `ubuntu` or `ec2-user`).
- `EC2_SSH_KEY`: The raw contents of the `.pem` key for SSH remote connection execution.
- `ENV_FILE`: The concatenated `.env` file to be copied securely to the production environment ahead of the Docker build. 
