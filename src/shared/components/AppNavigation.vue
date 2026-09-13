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
  gap: 8px;
}

.app-navigation a {
  padding: 10px;
  text-decoration: none;
}

.app-navigation a.router-link-active {
  font-weight: 600;
}
</style>