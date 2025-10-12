// src/Invitation.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

/**
 * Página que gestiona la invitación enviada por email.
 * URL esperada (ejemplo):
 *   https://pickpad.vercel.app/invitacion?type=invite&token_hash=ABC123&next=%2Fdashboard
 *
 * Parámetros:
 *   - type        = "invite" (solo procesamos este tipo)
 *   - token_hash  = token de un solo uso creado por la Edge Function
 *   - next        = ruta opcional a la que redirigir después de crear la cuenta
 */
export default function Invitation() {
  const location = useLocation();          // Obtiene la URL completa
  const navigate = useNavigate();          // Para redirigir al usuario
  const [email, setEmail] = useState(""); // Email que el usuario escribe
  const [pwd, setPwd] = useState("");     // Nueva contraseña
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [msg, setMsg] = useState("");     // Mensaje de error / info

  // -------------------------------------------------------------
  // 1️⃣  Parseamos los query‑params una sola vez al montar
  // -------------------------------------------------------------
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const type = qs.get("type");
    const token = qs.get("token_hash");
    const next = qs.get("next");

    // Si no es una invitación válida, avisamos al usuario
    if (type !== "invite" || !token) {
      setStatus("error");
      setMsg("Enlace de invitación no válido");
      return;
    }

    // Guardamos token y redirección en sessionStorage (sobrevive a refresco)
    sessionStorage.setItem("inviteTokenHash", token);
    if (next) sessionStorage.setItem("postInviteRedirect", decodeURIComponent(next));
  }, [location.search]);

  // -------------------------------------------------------------
  // 2️⃣  Cuando el usuario pulsa “Crear cuenta”
  // -------------------------------------------------------------
  const handleCreate = async () => {
    setStatus("loading");
    const token = sessionStorage.getItem("inviteTokenHash");

    if (!token) {
      setStatus("error");
      setMsg("Token de invitación perdido. Refresca la página.");
      return;
    }

    // ---------------------------------------------------------
    // Verificar el token (marca el email como verificado)
    // ---------------------------------------------------------
    const { error: verifyErr } = await supabase.auth.verifyOtp({
      type: "invite",
      email,
      token,
    });

    if (verifyErr) {
      setStatus("error");
      setMsg(`No se pudo confirmar la invitación: ${verifyErr.message}`);
      return;
    }

    // ---------------------------------------------------------
    // Crear la cuenta (signInWithPassword crea la sesión)
    // ---------------------------------------------------------
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: pwd,
    });

    if (signInErr) {
      setStatus("error");
      setMsg(`Error al crear la cuenta: ${signInErr.message}`);
      return;
    }

    // ---------------------------------------------------------
    // Redirección final: a la URL que el email incluía o a "/"
    // ---------------------------------------------------------
    const redirect = sessionStorage.getItem("postInviteRedirect") ?? "/";
    navigate(redirect, { replace: true });
  };

  // -------------------------------------------------------------
  // UI – simple, puedes aplicar tus propios estilos o Tailwind
  // -------------------------------------------------------------
  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Crear tu cuenta</h2>

      {status === "error" && <p style={{ color: "red" }}>{msg}</p>}

      <label>
        Email (debe ser el mismo al que recibiste la invitación):
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </label>

      <label style={{ marginTop: "1rem" }}>
        Nueva contraseña:
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </label>

      <button
        disabled={status === "loading"}
        onClick={handleCreate}
        style={{
          marginTop: "1.5rem",
          width: "100%",
          padding: "0.75rem",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {status === "loading" ? "Procesando…" : "Crear cuenta"}
      </button>
    </div>
  );
}