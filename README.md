# ChessTeacher Front End

This is the main frontend repository for the software part of a P2 project created by SW2 group 8 at Aalborg University
Copenhagen.

## Local Development

Copy [`.env.local.sample`](./.env.local.sample) into `.env.local` and [`.env.sample`](./.env.sample) into `.env`, and
add the credentials obtained from the Firebase project admin to it.

### Stockfish image

To run this project, you **need** to build the complementary image found in the
[audio-engineer/chess-teacher-stockfish](https://github.com/audio-engineer/chess-teacher-stockfish) repository first.
Once it's built, a container will automatically be created from that image once the Docker Compose commands down below
are run.

### Firebase image

You will also **need** to build the complementary `chess-teacher-firebase` image found in the
[audio-engineer/chess-teacher-firebase](https://github.com/audio-engineer/chess-teacher-firebase) repository.
Its container will also be automatically created from the image once the Docker Compose commands down below are run.

The Firebase Emulator Suite UI can be accessed at [localhost:4000](http://localhost:4000/).

### Running the local development environment

To start the Docker Compose project, run:

```shell
docker compose up -d
```

or, when using JetBrains WebStorm, by running the `Docker Compose` run configuration.

Then, start a new shell session in the `server` container:

```shell
docker exec -it chess-teacher-front-end-server-1 /bin/zsh
```

The first time the project is cloned, or when dependencies in [`package.json`](./package.json)
or [`package-lock.json`](./package-lock.json) have changed, in the `server` container run:

```shell
npm install
```

Now the development server can be started in the `server` container:

```shell
npm run dev
```

The front end is now accessible at [localhost:3000](http://localhost:3000/).

When code is pushed to the remote repository, the [Prettier](./.github/workflows/prettier.yml)
and [ESLint](./.github/workflows/eslint.yml) actions are run.
Therefore, check your code for errors before committing and pushing by running the tools in the `server` container
first:

```shell
npm run prettier && npx eslint .
```

After a finished development cycle, exit the `server` container and run:

```shell
docker compose down
```

### Development Containers (Visual Studio Code)

...
