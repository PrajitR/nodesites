var pg = require('pg').native,
    // change 'prajit' to whatever your local db is called
    connectString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost/speedread',
    client,
    query;

var con = process.env.DATABASE_URL || { user: 'postgres', password: process.env.DB_PASSWORD, database: 'speedread' };
client = new pg.Client(con);
client.connect();

queryString = 'CREATE TABLE speedread (' +
              'user_id varchar (32) PRIMARY KEY,' +
              'speednews smallint,' +
              'regnews smallint,' +
              'speedhist smallint,' +
              'reghist smallint,' +
              'speedfiction smallint,' +
              'regfiction smallint,' +
              'wpm_speednews smallint,' +
              'wpm_regnews smallint,' +
              'wpm_speedhist smallint,' +
              'wpm_reghist smallint,' +
              'wpm_speedfiction smallint,' +
              'wpm_regfiction smallint' +
              ');';

query = client.query(queryString)
query.on('end', function () { client.end(); });
