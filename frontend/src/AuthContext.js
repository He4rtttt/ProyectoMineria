import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    // Obtener el usuario del localStorage si existe
    return JSON.parse(localStorage.getItem('usuario')) || null;
  });

  const iniciarSesion = (data) => {
    setUsuario(data);
    localStorage.setItem('usuario', JSON.stringify(data)); // Guardar en localStorage
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario'); // Limpiar localStorage
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
