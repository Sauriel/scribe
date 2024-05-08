<template>
  <nav class="overview">
    <ul>
      <li>
        <NuxtLink
          to="/doc/create"
          class="magical-link"
        >
          <img
            src="@/assets/images/welcome/create.png"
            :alt="$t('welcome.quick-access.create')"
          >
          <header>
            <Icon name="fa6-solid:plus" />
            <span>
              {{ $t('welcome.quick-access.create') }}
            </span>
          </header>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/editor"
          class="magical-link"
        >
          <img
            src="@/assets/images/welcome/open.png"
            :alt="$t('welcome.quick-access.open')"
          >
          <header>
            <Icon name="fa6-solid:folder-open" />
            <span>
              {{ $t('welcome.quick-access.open') }}
            </span>
          </header>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/library"
          class="magical-link"
        >
          <img
            src="@/assets/images/welcome/library.png"
            :alt="$t('welcome.quick-access.library')"
          >
          <header>
            <Icon name="ion:library" />
            <span>
              {{ $t('welcome.quick-access.library') }}
            </span>
          </header>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/login"
          class="magical-link"
        >
          <img
            src="@/assets/images/welcome/register.png"
            :alt="$t('welcome.quick-access.register')"
          >
          <header>
            <Icon name="fa6-solid:user" />
            <span>
              {{ $t('welcome.quick-access.register') }}
            </span>
          </header>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.overview > ul {
  display: flex;
  justify-content: space-between;
}

.magical-link {
  display: grid;
  grid-template-areas: 'center';
  width: 150px;
  height: 250px;
  border-radius: var(--border-radius);
  overflow: hidden;
  color: var(--color-foreground-500);
  text-decoration: none;
}

.magical-link > img {
  grid-area: center;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  opacity: 0.5;
  transition: opacity 0.25s ease-in-out, scale 0.25s ease-in-out;
  z-index: 1;
}

.magical-link > header {
  grid-area: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
  font-size: 1.5em;
  z-index: 2;
  margin-top: 60px;
  transition: all 0.25s ease-in-out;
}

.magical-link > header > svg {
  font-size: 4rem;
  transition: opacity 0.25s ease-in-out;
}

.magical-link > header > span {
  transition: min-heigh 0.25s ease-in-out;
  display: inline-block;
  text-align: center;
}
.magical-link:hover > img {
  opacity: 1;
  scale: 1.1;
}

.magical-link:hover > header {
  filter: drop-shadow(2px 2px 4px var(--color-background-900));
  margin-top: 125px;
  font-size: 1.5em;
}

.magical-link:hover > header > svg {
  opacity: 0;
}
</style>