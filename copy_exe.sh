#!/bin/bash

# Set variables
IMAGE_NAME="simple-mod-manager"
CONTAINER_NAME="simple-mod-manager-container"
OUTPUT_DIR="./output"
EXE_NAME="simple-mod-manager.exe"

# Step 1: Build the Docker image
docker build -t $IMAGE_NAME .

# Step 2: Create a container from the image
docker create --name $CONTAINER_NAME $IMAGE_NAME

# Step 3: Copy the compiled .exe file from the container to the host machine
docker cp $CONTAINER_NAME:/usr/local/bin/$EXE_NAME $OUTPUT_DIR/$EXE_NAME

# Step 4: Clean up the container
docker rm $CONTAINER_NAME

echo "Executable copied to $OUTPUT_DIR/$EXE_NAME"
