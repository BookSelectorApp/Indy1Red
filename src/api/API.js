const API_URL = "https://indy1red.onrender.com";

export const registerUser = async (username, password) => {
    const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};
  
export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};

export const addToTBR = async (user_id, book_id) => {
    const response = await fetch(`${API_URL}/tbr/add/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, book_id }),
    });
    return response.json();
};

export const removeFromTBR = async (user_id, book_id) => {
    const response = await fetch(`${API_URL}/tbr/remove/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, book_id }),
    });
    return response.json();
};

export const viewTBR = async (user_id) => {
    const response = await fetch(`${API_URL}/tbr/view/?user_id=${user_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

export const addTitle = async (user_id, title) => {
    const response = await fetch(`${API_URL}/preferences/add-title/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, title }),
    });
    return response.json();
};

export const addGenre = async (user_id, genre) => {
    const response = await fetch(`${API_URL}/preferences/add-genre/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, genre }),
    });
    return response.json();
};

export const deleteTitle = async (user_id, title) => {
    const response = await fetch(`${API_URL}/preferences/delete-title/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, title }),
    });
    return response.json();
};

export const deleteGenre = async (user_id, genre) => {
    const response = await fetch(`${API_URL}/preferences/delete-genre/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, genre }),
    });
    return response.json();
};

export const getPreferences = async (userId) => {
    const response = await fetch(`${API_URL}/preferences/?user_id=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

export const getRecommendations = async (genres = "", titles = "") => {
    const response = await fetch(`${API_URL}/recommendations/?genres=${genres}&titles=${titles}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};