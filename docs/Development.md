# Development
This document provides guidelines and instructions for contributing to the development of this project.

## Quick start
To get started with development, follow these steps:

1. Clone git repository, open it in your [IDE](#ide) inside a [dev container](#dev-containers)
2. Run `turbo dev` to start all projects in development mode and start coding
3. Run `turbo ci` to trigger local ci (build, check and test)

## System requirements

You MAY use Linux, macOS or Windows as development OS with AMD64 or ARM64 processor architecture. For Windows you MUST use [WSL 2](https://docs.docker.com/desktop/wsl/).

It is REQUIRED to install a [supported container runtime](https://code.visualstudio.com/docs/devcontainers/containers#_system-requirements) including [Docker](https://docs.docker.com/get-docker/) and [Podman](https://podman.io).

## Environment

### Dev containers

This project uses [dev containers](https://containers.dev) to ensure a reproducible, consistent development and ci environment.

![devcontainer stages](https://raw.githubusercontent.com/devcontainers/spec/main/images/dev-container-stages.png)

### IDE

You MAY use [any IDE which supports dev containers](https://containers.dev/supporting#editors), but it is RECOMMENDED to use [VSCode](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) or [GitHub Codespaces](https://github.com/features/codespaces).

### Turborepo

This project uses [Turborepo](https://turbo.build/repo) as monorepo build system and task runner.
