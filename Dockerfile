# ==================# --- Stage 1: Build the Frontend ---
FROM node:20-slim AS build-stage
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Setup the Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies for Playwright/Chromium
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxext6 \
    libxfixes3 libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 \
    liblayout1 libpango-1.0-0 libharfbuzz0b libwayland-client0 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m playwright install chromium --with-deps

# Copy backend code
COPY . .

# Copy built frontend files to Python's static folder
COPY --from=build-stage /app/frontend/dist /app/static

# Final startup command
# Initializes database then starts the server
CMD ["sh", "-c", "python setup_database.py init && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
===================================
