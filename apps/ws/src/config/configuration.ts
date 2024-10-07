export default () => ({
  port: parseInt(process.env.WS_PORT, 10) || 5000,
  database: {
    url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/geveze',
  },
  jwt_secret: process.env.JWT_SECRET || 'sshh',
  redis_port: process.env.REDIS_PORT || 6379,
  redis_host: process.env.REDIS_HOST || 'localhost',
});
