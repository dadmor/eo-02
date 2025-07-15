import { AuthBindings } from "@refinedev/core";
import { supabaseClient } from ".";

interface CustomError {
  message: string;
  name: string;
  details?: Record<string, any>;
}

const handleError = (error: unknown): CustomError => {
  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }
  return { message: "Nieznany błąd", name: "UnknownError" };
};

const handleSupabaseError = (error: any): CustomError => {
  if (!error) return { message: "Nieznany błąd", name: "UnknownError" };

  let message = error.message;
  let name = "SupabaseError";
  let details;

  if (
    message.includes("User already registered") ||
    message.includes("already exists")
  ) {
    message = "Konto z tym adresem email już istnieje.";
    name = "UserAlreadyExists";
    details = { code: "user_already_exists" };
  } else if (message.includes("Password should be at least")) {
    message = "Hasło musi mieć co najmniej 6 znaków.";
    name = "PasswordTooShort";
    details = { code: "password_too_short" };
  }

  return { message, name, details };
};

export const authProvider: AuthBindings = {
  login: async ({ email, password, providerName }) => {
    try {
      if (providerName) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: providerName,
        });
        if (error) return { success: false, error: handleSupabaseError(error) };
        return { success: true, redirectTo: data?.url };
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { success: false, error: handleSupabaseError(error) };

      return { success: true, redirectTo: `/${data.user.user_metadata?.role}` || "/" };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  register: async ({ email, password, role, operator_id }) => {
    try {
      const metadata: Record<string, any> = {
        role,
        ...(operator_id && { operator_id }),
      };
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });

      if (error) return { success: false, error: handleSupabaseError(error) };
      if (!data?.user)
        return {
          success: false,
          error: {
            message: "Rejestracja nie powiodła się.",
            name: "RegistrationError",
          },
        };

      const isNewUser = data.user.identities && data.user.identities.length > 0;
      return isNewUser
        ? { success: true, user: data.user, session: data.session }
        : {
            success: false,
            error: {
              message: "Użytkownik z tym adresem email już istnieje.",
              name: "UserAlreadyExists",
            },
          };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) return { success: false, error: handleSupabaseError(error) };
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  updatePassword: async ({ password }) => {
    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) return { success: false, error: handleSupabaseError(error) };
      return { success: true, redirectTo: "/" };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) return { success: false, error: handleSupabaseError(error) };
    return { success: true, redirectTo: "/login" };
  },

  onError: async (error) => ({ error: handleError(error) }),

  check: async () => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      return { authenticated: !!data.session };
    } catch {
      return { authenticated: false };
    }
  },

  getPermissions: async () => {
    const { data } = await supabaseClient.auth.getUser();
    return data?.user?.role || null;
  },

  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();
    return data?.user ? { ...data.user, name: data.user.email } : null;
  },
};
