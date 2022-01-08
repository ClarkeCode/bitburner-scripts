# Bitburner

This is a repository for my [Bitburner scripts](https://store.steampowered.com/app/1812820/Bitburner/)

![Bitburner Logo](https://cdn.akamai.steamstatic.com/steam/apps/1812820/header.jpg?t=1639251301 "Bitburner Logo")
> Bitburner is a programming-based incremental game. Write scripts in
> JavaScript to automate gameplay, learn skills, play minigames, solve
> puzzles, and more in this cyberpunk text-based incremental RPG.

## Setup
* Copy `update.sh` and `move-from-downloads.sh` to the directory where you would like to keep your Bitburner scripts
* Change **`DL_PATH`** in `move-from-downloads.sh` to match your default download location
* Download your `.js` files to your default location with the `download *.js` command in Bitburner
* Run `update.sh` - Your files can now be found in the `./scripts` directory
