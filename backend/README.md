# betterstack-backend

## Database migrations

> [!NOTE]
> Build Nest app beforehand using `npm run build`

Generate a migration
```
npm run migration:gen database/migrations/$MIGRATION_NAME
```

Then apply using
```
npm run migration:run
```

To revert the changes run
```
npm run migration:rev
```
