<template>
    <div>
      <h1>{{ isEditMode ? 'Edit Article' : 'Add Article' }}</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="title">Название статьи:</label>
          <input v-model="article.title" id="title" type="text" required />
        </div>
        <div>
          <label for="content">Текст статьи:</label>
          <textarea v-model="article.content" id="content" rows="5" required></textarea>
        </div>
        <button type="submit">{{ isEditMode ? 'Update Article' : 'Добавить статью' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    props: {
      articleId: {
        type: Number,
        default: null
      }
    },
    setup(props) {
      const article = ref({
        title: '',
        content: ''
      });
  
      const isEditMode = computed(() => props.articleId !== null);
  
      const fetchArticle = async () => {
        if (isEditMode.value) {
          try {
            const response = await axios.get(`/api/articles/${props.articleId}`);
            article.value = response.data;
          } catch (error) {
            console.error('Error fetching article:', error);
          }
        }
      };
  
      const handleSubmit = async () => {
        try {
          if (isEditMode.value) {
            await axios.patch(`/api/articles/${props.articleId}`, article.value);
          } else {
            await axios.post('/api/articles', article.value);
          }
          // Redirect or notify user after successful operation
        } catch (error) {
          console.error('Error saving article:', error);
        }
      };
  
      onMounted(fetchArticle);
  
      return {
        article,
        isEditMode,
        handleSubmit
      };
    }
  };
  </script>