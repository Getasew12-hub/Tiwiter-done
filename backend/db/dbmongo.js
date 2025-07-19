import pg from "pg";
import env from "dotenv"
import express from "express";
  env.config();


const db=new pg.Client({
connectionString:process.env.CONECTION_STRING,
ssl:{
  rejectUnauthorized:false,
   require: true
}
})
db.connect();

export default db;