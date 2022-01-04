cd ~/dev/Discord-MushroomBot;
git pull;
rm -rf node_modules;
npm ci --production;
pm2 kill;
npm run clean;
npm run build;
pm2 start java -- -jar lavalink-server/Lavalink.jar;
pm2 start output/src/bot.js;