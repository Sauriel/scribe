<template>
  <div id="scribe-app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div id="global-components">
      <ScToastWrapper />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const { user } = useScribeUser();

onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      router.push('/');
    } else if (user && typeof route.query.redirect === 'string') {
      router.push(route.query.redirect);
    }
  })
})
</script>

<style scoped>
#global-components {
  position: static;
}
</style>