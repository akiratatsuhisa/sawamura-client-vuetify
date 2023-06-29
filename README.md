# Vuetify App

![license](https://img.shields.io/badge/License-MIT-green.svg)
![version](https://img.shields.io/badge/version-0.0.1%20alpha-brightgreen.svg)
![state](https://img.shields.io/badge/state-ongoing-blue.svg)
![test](https://img.shields.io/badge/bug-crit-red.svg)

#### Table of Contents

- [About](#about)
- [Development](#development)
  - [Local installation](#local-installation)
  - [Docker](#docker)
- [License](#license)

## About

This repository is intended for learning and practicing coding. However, please note that this application may contain bugs, and I advise against using it for commercial or personal purposes, as it has not been secured and tested.

The project utilizes a web API from [first-nestjs-app](https://github.com/akiratatsuhisa/first-nestjs-app).

This front-end app is modeled after Facebook's messenger and offers a variety of features to facilitate communication between users. It supports both one-on-one and group chats, and users can customize their chat rooms by changing the chat room's image and chat name. Group chat's member have additional control over the chat, including the ability to invite or remove members, update member roles, and change nicknames. Furthermore, the app enables users to share files by allowing uploads and downloads within chat conversations. With these features, users can easily communicate and share information with friends.

## Development

For installation instructions, please use the following ways.

- [Local installation](#local-installation)
- [Docker](#docker)

## Local installation

### Prerequisites

**Node.js (v18 or higher)**

See the [official Node.js installation documentation](https://nodejs.org/).

### Installation

To install the application, clone the repository and install the required dependencies:

```bash
$ git clone https://github.com/akiratatsuhisa/sawamura-client-vuetify.git
```

Install Dependencies for client app, open new terminal.

```bash
$ npm install
```

Next, create an `.env` file with the following contents:

| KEY                    | DESCRIPTION                                                                        | EXAMPLE VALUE             |
| ---------------------- | ---------------------------------------------------------------------------------- | ------------------------- |
| VITE_WS_URL            | WebSockets URL used for connecting to the backend server.                          | ws://localhost:4000       |
| VITE_API_URL           | URL for making API requests to the backend server.                                 | http://localhost:4000     |
| VITE_NO_AVATAR_URL     | URL for a default avatar image when a user does not have a profile picture.        | /images/no-avatar.png     |
| VITE_NO_BACKGROUND_URL | URL for a default background image when a image does not have a custom background. | /images/no-background.png |

OAuth2 variables:

| KEY                      | DESCRIPTION                                                        | EXAMPLE VALUE                      |
| ------------------------ | ------------------------------------------------------------------ | ---------------------------------- |
| VITE_GOOGLE_CLIENT_ID    | Client ID provided by Google for OAuth2 authentication.            |                                    |
| VITE_GOOGLE_CALLBACK_URL | The callback URL registered with Google for OAuth2 authentication. | http://localhost:4000/oauth/google |
| VITE_GITHUB_CLIENT_ID    | Client ID provided by GitHub for OAuth2 authentication.            |                                    |
| VITE_GITHUB_CALLBACK_URL | The callback URL registered with GitHub for OAuth2 authentication. | http://localhost:4000/oauth/github |

## Running the app

```bash
# development
$ npm start

# or
$ npm run dev
```

## Docker

### Prerequisites

**Docker (v20 or higher)**

Please see the [official Docker installation documentation](https://docs.docker.com/get-docker/) for installation instructions.

### Installation

To install the application using Docker, clone the repository and create an .env file with the same contents as for [Local Installation](#local-installation).

### Running

To run the application in a Docker container, use the following commands:

```bash
# Dockerfile hasn't been create
```

## License

This application is released under the [MIT license](LICENSE).
