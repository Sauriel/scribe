import express from "express";

declare global {
  namespace Express {
    interface User {
      userId: String;
      iat?: number; // issues at
      exp?: number; // expires
    }
  }
}