### Backend for Market Lens Web App

- Simple HTTP server that forwards user requests to the polygon API
- Uses containerized system with docker container listening at port 8080 and nginx listening on HTTP port 80, forwarding to port 8080
- nginx is used as a reverse proxy
