# AAU P2 Software

This is the main frontend repository for the software part of a P2 project created by SW2 group 8 at Aalborg University
Copenhagen.

## Stockfish

A simple Stockfish image provides a containerized version of Stockfish.

In the project root directory, run:

```shell
docker build -t aau-p2/stockfish:latest stockfish/
```

After the build has finished, the `stockfish` software can be started in a container using:

```shell
docker run -it aau-p2/stockfish:latest stockfish
```
