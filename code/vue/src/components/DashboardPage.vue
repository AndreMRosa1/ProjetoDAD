<template>
  <div class="dashboard">
    <aside class="dashboard-sidebar">
      <nav>
        <RouterLink to="/dashboard/new-memory-game" class="nav-link">Single Player Game</RouterLink>
        <RouterLink to="/dashboard/multiplayer" class="nav-link">Multiplayer Game</RouterLink>
        <RouterLink to="/dashboard/history" class="nav-link">Game History</RouterLink>
        <RouterLink to="/dashboard/scoreboards" class="nav-link">Scoreboards</RouterLink>
        <RouterLink to="/dashboard/statistics" class="nav-link">Statistics</RouterLink>
      </nav>
    </aside>
    <main class="dashboard-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
// No script needed for this layout
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
}

.dashboard-sidebar {
  width: 250px;
  background-color: #f8f9fa;
  padding: 1rem 0.5rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.nav-link {
  display: block;
  margin-bottom: 1rem;
  text-decoration: none;
  color: #007bff;
}

.nav-link:hover {
  text-decoration: underline;
}

.dashboard-content {
  flex: 1;
  padding: 1rem;
}
</style>