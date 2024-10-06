export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/geveze',
  },
  jwt_secret: process.env.JWT_SECRET || 'sshh',
});
