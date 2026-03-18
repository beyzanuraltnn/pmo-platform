FROM mcr.microsoft.com/devcontainers/dotnet:1-8-bookworm

ARG NODE_MAJOR=20

RUN curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs postgresql-client \
    && npm install -g npm@latest \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
