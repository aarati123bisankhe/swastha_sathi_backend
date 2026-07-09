import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 6000;

export const MONGODB_URI:string = process.env.MONGODB_URI || 'mongodb://localhost:27017/default_db';

export const SKIP_DB_CONNECT: boolean = process.env.SKIP_DB_CONNECT === 'true';

export const JWT_SECRET: string = process.env.JWT_SECRET || 'my_jwt';
