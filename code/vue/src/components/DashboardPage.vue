<template>
  <div class="flex h-screen" style="max-height: 100;">
    <aside class="w-64 bg-gray-100 p-4 shadow-md">
      <nav>
        <RouterLink to="/new-memory-game" class="block mb-4 text-blue-500 hover:underline">
          Single Player Game
        </RouterLink>
        <RouterLink to="/multiplayer" class="block mb-4 text-blue-500 hover:underline">
          Multiplayer Game
        </RouterLink>
        <RouterLink to="/transactions/history" class="block mb-4 text-blue-500 hover:underline">
          Transaction History
        </RouterLink>
      </nav>
    </aside>

    <main class="flex-1 p-4">
      <RouterView />
    </main>
  </div>
</template>
