// pages/auth/index.js
import { Route } from "react-router";
import { LoginPage } from "./login";
import { RegisterPage } from "./register";
import { ForgotPasswordPage } from "./forgot-password";
import { UpdatePasswordPage } from "./update-password";

// Komponenty
export { LoginPage } from './login';
export { RegisterPage } from './register';
export { ForgotPasswordPage } from './forgot-password';
export { UpdatePasswordPage } from './update-password';

// Routes - zwracamy JSX bezpośrednio, nie funkcję komponenta
export const authRoutes = [
  <Route key="auth-login" path="/login" element={<LoginPage />} />,
  <Route key="auth-register" path="/register" element={<RegisterPage />} />,
  <Route key="auth-forgot-password" path="/forgot-password" element={<ForgotPasswordPage />} />,
  <Route key="auth-update-password" path="/update-password" element={<UpdatePasswordPage />} />,
];