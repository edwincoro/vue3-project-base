<template>
  <nav class="app-navigation">
    <RouterLink to="/home">
      Inicio
    </RouterLink>

    <RouterLink to="/categories">
      Categorías
    </RouterLink>

    <RouterLink to="/products">
      Productos
    </RouterLink>
  </nav>
</template>

<style scoped>
.app-navigation {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.app-navigation a {
  padding: 12px 16px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.app-navigation a:hover {
  background-color: #f1f5f9;
  color: #3b82f6;
  transform: translateX(4px);
}

.app-navigation a.router-link-active {
  background: linear-gradient(135deg, #eff6ff, #f5f3ff);
  color: #2563eb;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.05);
  position: relative;
}

/* Indicador visual para el enlace activo */
.app-navigation a.router-link-active::before {
  content: '';
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 0 4px 4px 0;
}
</style>