# Use the official Rust image as the base image
FROM rust:latest

# Install necessary dependencies for cross-compilation
RUN apt-get update && apt-get install -y \
    gcc-mingw-w64-x86-64 \
    && rm -rf /var/lib/apt/lists/*

# Install the x86_64-pc-windows-gnu target for Rust
RUN rustup target add x86_64-pc-windows-gnu

# Create a new directory for the Rust project
WORKDIR /usr/src/myapp

# Copy the current directory contents into the container at /usr/src/myapp
COPY . .

# Build the Rust project for Windows target
RUN cargo build --release --target x86_64-pc-windows-gnu

# The final image is minimal, only containing the compiled binary
FROM scratch

# Copy the compiled binary from the builder image
COPY --from=0 /usr/src/myapp/target/x86_64-pc-windows-gnu/release/simple-mod-manager.exe /usr/local/bin/simple-mod-manager.exe

# Set the entrypoint to the compiled binary
ENTRYPOINT ["/usr/local/bin/simple-mod-manager.exe"]
