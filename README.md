# Discord fart bot

Sample discord bot, as a way to experiment with the following:

- [discord.js](https://discord.js.org/)
- [mikro-orm](https://mikro-orm.io/) with [MongoDB cloud services](https://www.mongodb.com/products/platform/cloud)
- [heroku](https://dashboard.heroku.com/)

What better way to get free QA from my son than to make a bot about farts?

Available at: https://discord.com/channels/739603316132282449/739603316132282453

## Development work

See `.env.example` for available configuration settings along with documentation, and create your local `.env` file.

```sh
# Stop the currently running bot
heroku ps:scale worker=0

# Start local dev server which will restart on src code change
npm start

# After deploying a new build, restart the heroku server
heroku ps:scale worker=1
```

To imitate production as close as possible, perform the `heroku` commands above and use this instead of `npm start`:

```sh
# Transpile TypeScript to JavaScript.
npm run build

# Run from the `build` directory.
npm run start:prod
```

To use local db resources instead of cloud db resources:

```sh
docker-compose up -d

#
# ...modify your `.env` to point to local resources...
#

# ...when done.
docker-compose down
```

## Application notes

- The application is written in `TypeScript`, transpiled to `JavaScript` for the runtime `nodejs`.
  - Two dependencies of note are our use of `discord.js` and `mikro-orm`.
- The application is hosted on `heroku`.
  - The application runs as a `resource` type of `worker`.
  - The application relies on configuration values being passed as env vars.
    - For development, we use `dot-env`.
    - For production, we pass in env vars via `heroku` configuration.
- The application operates as a `discord` bot.
- The application database is `mongodb`. 
  - For local development, we use a vanilla docker container.
  - For production we use a cloud hosted `mongodb`.
- The application cache is `redis`.
  - For local development, we use a vanilla docker container.
  - For production we use a cloud hosted `redis`.
