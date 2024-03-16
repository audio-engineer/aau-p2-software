FROM alpine:latest AS builder

RUN apk add -U --no-cache git g++ make && \
    git clone --depth 1 --branch sf_16.1 https://github.com/official-stockfish/Stockfish.git

WORKDIR /Stockfish/src/

RUN make -j build

FROM alpine:latest

RUN apk add -U --no-cache libstdc++ ucspi-tcp6 openssh-server supervisor && \
    addgroup -g 1000 stockfish && \
    adduser -u 1000 -G stockfish -D stockfish
RUN echo "stockfish:test123" | chpasswd

COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY --chmod=744 ./entrypoint.sh /entrypoint.sh
COPY ./sshd_config.conf /etc/ssh/sshd_config.d/sshd_config.conf
COPY ./motd /etc/motd

COPY --from=builder --chown=stockfish:stockfish /Stockfish/src/stockfish /usr/local/bin/
COPY --from=builder --chown=stockfish:stockfish /Stockfish/src/*.nnue /usr/local/bin/

EXPOSE 22 23249

ENTRYPOINT ["/entrypoint.sh"]

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
