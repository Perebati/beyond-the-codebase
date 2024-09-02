FROM golang:alpine as builder

RUN apk add --no-cache upx

WORKDIR /app
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o main . && upx --best --lzma -o main_packed main

FROM scratch
COPY --from=builder /app/main_packed /main

CMD ["./main"]
