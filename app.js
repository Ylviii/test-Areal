const express = require('express');
const { Article, Comment } = require('./models'); 
const app = express();

app.use(express.json());

// CRUD для Article
app.post('/article', async (req, res) => {
    const { title, content } = req.body;
    try {
      const newArticle = await Article.create({ title, content });
      res.json(newArticle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/article/:id', async (req, res) => {
    const articleId = req.params.id;
    try {
      const article = await Article.findByPk(articleId);
      if (article) {
        res.json(article);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.findAll();
        res.json(articles);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

app.patch('/article/:id', async (req, res) => {
    const articleId = req.params.id;
    const { title, content } = req.body;
    try {
      const article = await Article.findByPk(articleId);
      if (article) {
        await article.update({ title, content });
        res.json(article);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.delete('/article/:id', async (req, res) => {
    const articleId = req.params.id;
    try {
      const article = await Article.findByPk(articleId);
      if (article) {
        await article.destroy();
        res.json({ message: 'Article deleted successfully' });
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// CRUD для Comment
app.post('/article/:id/comment', async (req, res) => {
    const articleId = req.params.id;
    const { content } = req.body;
    try {
      const article = await Article.findByPk(articleId);
      if (article) {
        const newComment = await Comment.create({ content, articleId });
        res.json(newComment);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/article/:id/comment/:commentId', async (req, res) => {
    const articleId = req.params.id;
    const commentId = req.params.commentId;
    try {
      const comment = await Comment.findOne({ where: { id: commentId, articleId } });
      if (comment) {
        res.json(comment);
      } else {
        res.status(404).json({ error: 'Comment not found for the article' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/article/:id/comments', async (req, res) => {
    const articleId = req.params.id;
    try {
      const comments = await Comment.findAll({ where: { articleId } });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.patch('/article/:id/comment/:commentId', async (req, res) => {
    const articleId = req.params.id;
    const commentId = req.params.commentId;
    const { content } = req.body;
    try {
        const comment = await Comment.findOne({ where: { id: commentId, articleId } });
        if (comment) {
        await comment.update({ content });
        res.json(comment);
        } else {
        res.status(404).json({ error: 'Comment not found for the article' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/article/:id/comment/:commentId', async (req, res) => {
    const articleId = req.params.id;
    const commentId = req.params.commentId;
    try {
      const comment = await Comment.findOne({ where: { id: commentId, articleId } });
      if (comment) {
        await comment.destroy();
        res.json({ message: 'Comment deleted successfully' });
      } else {
        res.status(404).json({ error: 'Comment not found for the article' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


const { Op } = require('sequelize');
// Маршрут для получения комментариев за период
app.get('/analytic/comments', async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const comments = await Comment.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: [
          'articleId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalComments']
        ],
        group: ['articleId'],
        include: {
          model: Article, // Если вам нужна информация о статьях
          attributes: ['title'] // Укажите необходимые атрибуты статьи
        }
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
