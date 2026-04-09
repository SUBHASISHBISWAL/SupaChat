# Deployment Guide (AWS EC2)

SupaChat is primarily designed to be deployed to an AWS EC2 instance. The following configuration defines the production deployment steps.

## Production Topology
- **Host:** AWS EC2 Ubuntu Instance
- **Orchestration:** `docker-compose.yml`
- **Routing:** Nginx Reverse Proxy
- **Ports Configured:**
  - `80` (HTTP) - Main App
  - `3000` (HTTP) - Grafana Monitoring
  - `9090` (HTTP) - Prometheus Dashboard
  - `3100` (HTTP) - Loki Endpoint

## Manual Deployment Step-by-Step

### 1. Configure the Server
Connect to your EC2 instance and run the setup script:
```bash
ssh -i supachat-key.pem ubuntu@YOUR_EC2_IP
# Transfer the nodesource_setup.sh script and execute it
chmod +x nodesource_setup.sh
./nodesource_setup.sh
```

### 2. Prepare the Application Payload
Move the contents of the project to `~/supachat/` directory on the server. Make sure to generate the production `.env` file manually inside this directory.

### 3. Launch App Services
Start the main application stack:
```bash
cd ~/supachat
docker compose -f docker-compose.yml up -d --build
```

### 4. Configure Security Groups
Ensure the AWS Security Group tied to your EC2 instance has Inbound Rules configured correctly:
- Open Port `80` for standard HTTP Traffic (`0.0.0.0/0`)
- Open Port `3000` for Grafana (`0.0.0.0/0` or preferred IP whitelist)
- Open Port `22` for SSH
