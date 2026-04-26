import 'dotenv/config'; 

import app from './app.js';
import { connectDB } from './config/db.js';
import cors from "cors";
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "https://jyothi-admission.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Admission API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
