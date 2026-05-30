FROM debian:12.12-slim

# use bash inside running container
ENV SHELL=/bin/bash
# use bash while building container
SHELL ["/bin/bash", "-c"]

# create non-root user
ENV NON_ROOT_USER=dev
ENV NON_ROOT_USER_HOME=/home/${NON_ROOT_USER}
# default user and group id - user’s UID/GID will be updated to match
# the local user’s UID/GID to avoid permission problems (updateRemoteUserUID)
# https://containers.dev/implementors/json_reference/
ARG NON_ROOT_USER_UID=1000
ARG NON_ROOT_USER_GID=1000
RUN groupadd --gid ${NON_ROOT_USER_GID} ${NON_ROOT_USER} && \
    useradd ${NON_ROOT_USER} --uid ${NON_ROOT_USER_UID} --gid ${NON_ROOT_USER_GID} --create-home

# update package sources
RUN apt-get update && \
    apt-get upgrade -y

# install common tools
RUN apt-get install -y --no-install-recommends \
    ca-certificates \
    gnupg \
    lsb-release \
    curl \
    xz-utils \
    procps \
    git \
    git-lfs \
    jq

# nodejs
# renovate: source=github-tags name=nodejs/node versioning=semver
ENV NODE_VERSION=26.2.0
RUN NODE_MAJOR_VERSION=$(echo ${NODE_VERSION} | cut -d. -f1) && \
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR_VERSION}.x" | bash - && \
    apt-get install -y --no-install-recommends \
    nodejs="${NODE_VERSION}"*

# pnpm
# renovate: source=github-tags name=pnpm/pnpm versioning=semver
ENV PNPM_VERSION=10.15.1
RUN npm install -g pnpm@${PNPM_VERSION}

# turborepo
# renovate: source=github-tags name=vercel/turborepo versioning=semver
ENV TURBO_VERSION=2.5.6
ENV TURBO_GLOBAL_WARNING_DISABLED=true
RUN npm install -g turbo@${TURBO_VERSION}

# cleanup
RUN apt-get autoremove -y && \
    apt-get clean -y && \
    cd /tmp && rm -rf *
