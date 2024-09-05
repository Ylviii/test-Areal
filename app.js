require('dotenv').config();
const express = require('express');
const sequelize = require('./models'); // Подключение моделей
const app = express();
app.use(express.json());

const articleRoutes = require('./routes/article');
const commentRoutes = require('./routes/comment');

app.use('/article', articleRoutes);
app.use('/analytic', commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.sync();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
