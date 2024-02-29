FROM alpine:latest AS builder

RUN apk add -U --no-cache git g++ make \
    && git clone --depth 1 --branch sf_16.1 https://github.com/official-stockfish/Stockfish.git

WORKDIR /Stockfish/src/

RUN make -j build

FROM alpine:latest

RUN apk add -U --no-cache libstdc++

COPY --from=builder /Stockfish/src/stockfish /usr/local/bin/
COPY --from=builder /Stockfish/src/*.nnue /usr/local/bin/
