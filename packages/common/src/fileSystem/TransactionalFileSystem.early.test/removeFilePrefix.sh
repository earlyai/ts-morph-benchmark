#!/bin/zsh

# Define the directory
DIR="."

# Loop through all files with the prefix
for file in "$DIR"/TransactionalFileSystem.*; do
  # Extract the filename without the directory path
  filename=$(basename "$file")

  # Remove the prefix and rename the file
  mv "$file" "$DIR/${filename#TransactionalFileSystem.}"
done
