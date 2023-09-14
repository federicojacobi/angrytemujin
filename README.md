# Angry Temujin

This is a submission for the JS13k gamejam.

## Game description

The idea is to build an army of soldiers that can kill anything in their path ... on a vampire survivors inspired system.

## What is interesting about this game?

Created a small ECS system to make it all work (might release as a standalone), added a very small Behavior Tree (will probably release this as a standalone), used ESbuild for the modules and build. The final build runs through uglifyjs, then roadroller.

Because it is ECS, all the systems do basically one thing, and are easy to read/understand.

Unfortunately I couldn't do a webGL renderer, but given that it is a system it should be fairly simple to do.

## Build and dev

First, `npm install` ... of course.

To run the dev version: `npm run dev`.

To build the production version along with creating the ZIP file: `npm run build`

## To do

- Add boss fights
- Add easeIn and easeOut to movement
- Improve troops behavior
- Add a melee attack soldier
- Music / SFX
- Object pooling
