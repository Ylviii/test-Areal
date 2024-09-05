<template>
    <div>
      <h2>Comments</h2>
      <ul>
        <li v-for="comment in comments" :key="comment.id">
          <p>{{ comment.text }}</p>
          <button @click="editComment(comment.id)">Изменить</button>
          <button @click="deleteComment(comment.id)">Удалить</button>
        </li>
      </ul>
      <div v-if="editingCommentId !== null">
        <h3>Edit Comment</h3>
        <textarea v-model="editText" rows="4" cols="1"></textarea>
        <button @click="updateComment">Изменить</button>
        <button @click="cancelEdit">Отменить изменения</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    articleId: {
      type: Number,
      required: true
    }
  });
  
  const comments = ref([]);
  const editingCommentId = ref(null);
  const editText = ref('');
  
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/articles/${props.articleId}/comments`);
      comments.value = response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  const deleteComment = async (id) => {
    try {
      await axios.delete(`/api/comments/${id}`);
      comments.value = comments.value.filter(comment => comment.id !== id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  const editComment = (id) => {
    const comment = comments.value.find(c => c.id === id);
    if (comment) {
      editingCommentId.value = id;
      editText.value = comment.text;
    }
  };
  
  const updateComment = async () => {
    if (editingCommentId.value === null) return;
  
    try {
      await axios.patch(`/api/comments/${editingCommentId.value}`, { text: editText.value });
      const comment = comments.value.find(c => c.id === editingCommentId.value);
      if (comment) {
        comment.text = editText.value;
        editText.value = '';
        editingCommentId.value = null;
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  
  const cancelEdit = () => {
    editingCommentId.value = null;
    editText.value = '';
  };
  
  onMounted(fetchComments);
  </script>