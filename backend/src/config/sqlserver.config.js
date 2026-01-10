import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.SQLSERVER_NAME,
  database: process.env.SQLSERVER_DB,
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  port: parseInt(process.env.SQLSERVER_PORT, 10) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

let pool;

export const getPool = async () => {
  try {
    if (!pool) {
      console.log('Creating SQL Server connection pool...');
      pool = new sql.ConnectionPool(config);
      
      pool.on('error', (err) => {
        console.error('Database pool error:', err);
        pool = null;
      });

      await pool.connect();
      console.log('SQL Server connection pool established');
    }

    // Kiểm tra pool có còn connected không
    if (!pool.connected) {
      console.log('Pool disconnected, reconnecting...');
      pool = null;
      return getPool(); // Recursive call để tạo lại pool
    }

    return pool;
  } catch (err) {
    console.error('SQL Server connection failed:', err.message);
    pool = null;
    throw err;
  }
};

export const dbMiddleware = async (req, _res, next) => {
  try {
    req.db = await getPool();
    next();
  } catch (err) {
    next(err);
  }
};

export { config };