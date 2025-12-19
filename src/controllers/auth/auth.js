import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Configuración del cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: "Usuario registrado exitosamente", data });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para iniciar sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Inicio de sesión exitoso", data });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para cerrar sesión
const logoutUser = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Cierre de sesión exitoso" });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export { registerUser, loginUser, logoutUser };
