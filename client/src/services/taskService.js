import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');

// Get tasks with : search, pagination, and status filter
export const getTasks = async (params = {}) => {
  try {
    const { page = 1, limit = 6, search = '', status } = params;
    const query = new URLSearchParams();
    if (page > 1) query.set('page', page);
    if (limit) query.set('limit', limit);
    if (search.trim()) query.set('search', search.trim());
    if (status && status !== 'All') query.set('status', status);
    const url = query.toString() ? `${API_URL}/tasks?${query}` : `${API_URL}/tasks`;
    const response = await axios.get(url);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch tasks',
    };
  }
};

// Get single task
export const getTask = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch task',
    };
  }
};

// Create task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create task',
    };
  }
};

// Update task
export const updateTask = async (id, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update task',
    };
  }
};

// Delete task
export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/tasks/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete task',
    };
  }
};