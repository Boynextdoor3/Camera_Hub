import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import connectToDB from "./models/DB_conection.js";
import router from './router/router.js';

const app = express();

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(router);

app.get('/camera/list', async (req, res) => {
  try {
      let filters = {};
      const search = req.query.search || '';
      if (search) {
          filters.$or = [
              { name: { $regex: search, $options: 'i' } },
              { type: { $regex: search, $options: 'i' } }
          ];
      }
      
      // Обробка фільтрів за типом камери
      const typeFilters = req.query.typeFilters;
      if (typeFilters && Array.isArray(typeFilters) && typeFilters.length > 0) {
          filters.type = { $in: typeFilters };
      }

      // Обробка фільтрів за брендом
      const brandFilters = req.query.brandFilters;
      if (brandFilters && Array.isArray(brandFilters) && brandFilters.length > 0) {
          filters.brand = { $in: brandFilters };
      }

      let query = Camera.find(filters);

      // Обробка сортування
      const sortBy = req.query.sortBy || 'name';
      let sortOptions = {};
      if (sortBy === 'name' || sortBy === 'type' || sortBy === 'weight') {
          sortOptions[sortBy] = 1;
      } else if (sortBy === 'date') {
          sortOptions.createdAt = -1;
      }

      query = query.sort(sortOptions);

      const cameras = await query.exec();
      res.json({ cameras });
  } catch (error) {
      console.error("Error fetching cameras:", error);
      res.status(500).json({ message: "Server error" });
  }
});


connectToDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Express server startup error:", err);
  });
