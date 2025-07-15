import { AuthBindings } from "@refinedev/core";
import { supabaseClient } from ".";

export const authProvider: AuthBindings = {
  login: async ({ email, password, providerName }) => {
    // sign in with oauth
    try {
      if (providerName) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: providerName,
        });

        if (error) {
          return {
            success: false,
            error,
          };
        }

        if (data?.url) {
          return {
            success: true,
            redirectTo: "/",
          };
        }
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data?.user) {
        console.log("Login successful for user:", data.user.email);
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid email or password",
      },
    };
  },
  register: async ({ email, password, role, operator_id }) => {
    try {
      console.log("🔄 Rozpoczynam rejestrację dla:", email, "operator_id:", operator_id);
  
      // Budujemy metadata dynamicznie
      const metadata: Record<string, any> = { role };
      if (operator_id) {
        metadata.operator_id = operator_id;
      }
  
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
  
      if (error) {
        console.error("❌ Supabase registration error:", error);
        return {
          success: false,
          error: {
            message: error.message,
            name: error.name || "Registration Error",
            details: error,
          },
        };
      }
  
      if (data?.user) {
        console.log("✅ Użytkownik utworzony:", data.user.email);
        if (data.user && !data.user.email_confirmed_at) {
          console.log("📧 Email wymaga potwierdzenia");
        }
        return {
          success: true,
          user: data.user,
          session: data.session,
        };
      }
  
      console.error("❌ Brak danych użytkownika w odpowiedzi");
      return {
        success: false,
        error: {
          message: "Registration failed - no user data returned",
          name: "Registration Error",
        },
      };
  
    } catch (error: any) {
      console.error("❌ Registration catch error:", error);
      return {
        success: false,
        error: {
          message: error.message || "Registration failed",
          name: error.name || "Network Error",
          details: error,
        },
      };
    }
  },
  
  forgotPassword: async ({ email }) => {
    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        return {
          success: true,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Forgot password failed",
        name: "Invalid email",
      },
    };
  },
  updatePassword: async ({ password }) => {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
    return {
      success: false,
      error: {
        message: "Update password failed",
        name: "Invalid password",
      },
    };
  },
  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/",
    };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  check: async () => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      const { session } = data;

      if (!session) {
        return {
          authenticated: false,
          error: {
            message: "Check failed",
            name: "Session not found",
          },
          logout: true,
          redirectTo: "/login",
        };
      }
    } catch (error: any) {
      return {
        authenticated: false,
        error: error || {
          message: "Check failed",
          name: "Not authenticated",
        },
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async () => {
    const user = await supabaseClient.auth.getUser();

    if (user) {
      return user.data.user?.role;
    }

    return null;
  },
  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();

    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }

    return null;
  },
};