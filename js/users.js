// User logic
const USER_KEY = "sigilious_users";
const CURRENT_KEY = "sigilious_current_user";

export function getUsers() {
  return JSON.parse(localStorage.getItem(USER_KEY) || "[]");
}

export function saveUsers(users) {
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

export function registerUser({ name, email, password }) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, message: "El email ya está registrado." };
  }
  const user = { id: `u${Date.now()}`, name, email, password };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function login(email, password) {
  const user = getUsers().find((u) => u.email === email && u.password === password);
  if (!user) return { success: false, message: "Credenciales inválidas." };
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function getCurrentUser() {
  const stored = localStorage.getItem(CURRENT_KEY);
  return stored ? JSON.parse(stored) : null;
}
