import pg from "pg";
import env from "dotenv"
import express from "express";
  env.config();


const db=new pg.Pool({
connectionString:process.env.CONECTION_STRING,
ssl:{
  rejectUnauthorized:false,
   require: true
},
max:40,
idleTimeoutMillis:3000,


})
db.connect();

export default db;