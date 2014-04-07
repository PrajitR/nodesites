var con = process.env.DATABASE_URL || { user: 'postgres', password: process.env.DB_PASSWORD, database: 'speedread' };

module.exports = con;
