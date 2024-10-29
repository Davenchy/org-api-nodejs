# ORG-API Node.js

Temporary project repository for Node.js and Express.js api

## Requirements

- **MongoDB** server running on **localhost** on port **27017**

To modify configurations, see environment variables with default values in
`src/config.ts`

As an example, to make the server listen on port **3000**, set the env var
**SERVER_HOST** to **3000** before running the server or write it to `.env`
file.

## Usage

A list of defined npm scripts:

- **start:** starts the server in production, must build first.
- **dev:** starts the server in development/watch mode
- **build:** builds the typescript source code to a javascript code in the `build`
  directory
- **check:** runs biome.js linter, formatter against the source code
- **fix:** runs the **check** script and auto fixes all source and auto sorts
  imports.
- **ci:** runs the **check** script in **continues integration** environment.
- **test:** runs jest for testing
- **test-watch:** runs jest in watch mode

## Endpoints

### SignUp

Request: POST /signup

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

Response:

```json
{
  "message": "string"
}
```

Status Codes:

- **201:** user created
- **400:** invalid request body, check message for more information.
  It could be:
  - Invalid/missing: name. It must be at least 3 characters
  - Invalid/missing email format
  - Invalid/missing password:
    Password must contain at numbers, uppercase and lowercase letters, symbols
    Password must be at least 8 characters long
- **409:** email already exists
- **500:** Internal server error
