# AAU P2 Software

This is the main frontend repository for the software part of a P2 project created by SW2 group 8 at Aalborg University
Copenhagen.

## Local Development

To start the Docker Compose project, run:

```shell
docker compose up -d
```

or, when using JetBrains WebStorm, by running the `Docker Compose` run configuration.

Then, start a new shell session in the `server` container:

```shell
docker exec -it aau-p2-software-server-1 /bin/zsh
```

The first time the project is cloned, or when dependencies in [`package.json`](./package.json)
or [`package-lock.json`](./package-lock.json) have changed, run:

```shell
npm install
```

Now the development server can be started:

```shell
npm run dev
```

When code is pushed to the remote repository, the [Prettier](./.github/workflows/prettier.yml)
and [ESLint](./.github/workflows/eslint.yml) actions are run.
Therefore, check your code for errors before committing and pushing:

```shell
npm run prettier && npx eslint .
```

After a finished development cycle, exit the `server` container and run:

```shell
docker compose down
```

### Development Containers (Visual Studio Code)

...

### Stockfish

The project includes a simple Stockfish image that provides a containerized version of Stockfish.

To build it, in the project root directory run:

```shell
docker build -t aau-p2/stockfish:latest stockfish/
```

### Running Stockfish

After the build has finished, the Stockfish software can be started in a container using the following methods:

#### 1. `stockfish` command in container

The following command will automatically start the Stockfish software in the container:

```shell
docker run -it --rm aau-p2/stockfish:latest stockfish
```

#### 2. Shell session in container

To log into the container and start a new shell session, run:

```shell
docker run -it --rm aau-p2/stockfish:latest /bin/sh
```

Stockfish can then be started manually in the container's shell:

```shell
stockfish
```

#### 3. Direct Netcat

If the container is run in detached mode and the container's port `23249` is bound to the host's port `23249`, it's
possible to use Stockfish over TCP:

```shell
docker run -d --rm -p 23249:23249 aau-p2/stockfish:latest
```

Now run Netcat to start the connection:

```shell
# On macOS
nc localhost 23249
```

#### 4. SSH login

If the container's port 22 is bound to the host's port 22, it's possible to log into the container using SSH:

```shell
docker run -d --rm -p 22:22 aau-p2/stockfish:latest
```

Then run and enter the password `test123`:

```shell
ssh stockfish@localhost
```

Now the `stockfish` command can be executed manually:

```shell
stockfish
```

#### 5. Forwarded Netcat

Finally, SSH port forwarding can also be used. For this method, start a detached container and bind port `22`:

```shell
docker run -d --rm -p 22:22 aau-p2/stockfish:latest
```

Then set up SSH port forwarding. This command will forward the container's port `23249` to port `4040` on the host:

```shell
ssh -fNTL 4040:localhost:23249 stockfish@localhost
```

Now Netcat can be run on port `4040`:

```shell
# On macOS
nc localhost 4040
```
