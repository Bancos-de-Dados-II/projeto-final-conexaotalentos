const API_URL = "http://localhost:5000/api"; // Altere para a URL do seu servidor

// Função para obter o token do localStorage
const getToken = () => localStorage.getItem("token");

// Função para fazer logout
const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "login.html"; // Redireciona para a página de login
};

// Exemplo de função para mostrar erros
const showError = (message) => {
    alert(message);
};
