{ pkgs ? import (fetchTarball
  "https://github.com/NixOS/nixpkgs/archive/1cdd36c0d2e09a6031c639d597197ffdd4a64618.tar.gz")
  { } }:

with pkgs;

mkShell { buildInputs = [ nodejs-18_x ]; }
