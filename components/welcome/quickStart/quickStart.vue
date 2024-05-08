<template>
  <nav class="quick-start">
    <ul class="quick-start-list">
      <li class="quick-start-list-entry">
        <Icon
          name="fa6-solid:plus"
          class="quick-start-icon"
        />
        <header class="quick-start-caption">
          {{ $t('welcome.quick-access.create') }}
        </header>
      </li>
      <li class="quick-start-list-entry">
        <Icon
          name="fa6-solid:folder-open"
          class="quick-start-icon"
        />
        <header class="quick-start-caption">
          {{ $t('welcome.quick-access.open') }}
        </header>
      </li>
      <li class="quick-start-list-entry">
        <Icon
          name="ion:library"
          class="quick-start-icon"
        />
        <header class="quick-start-caption">
          {{ $t('welcome.quick-access.library') }}
        </header>
      </li>
      <li class="quick-start-list-entry">
        <Icon
          name="fa6-solid:user"
          class="quick-start-icon"
        />
        <header class="quick-start-caption">
          {{ $t('welcome.quick-access.register') }}
        </header>
      </li>
    </ul>
  </nav>
</template>

<style lang=scoped>
.quick-start-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.quick-start-list-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 8rem;
  aspect-ratio: 1 / 1;
  padding: 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.quick-start-list-entry:hover {
  background-color: var(--color-background-400);
}

.quick-start-icon {
  margin-bottom: 1rem;
  font-size: 4rem;
}

.quick-start-caption {
  font-size: 0.8rem;
}
</style>