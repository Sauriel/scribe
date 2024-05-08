<template>
  <LayoutMainCentered>
    <ScFloatingPanel
      v-if="user"
      :title="user.displayName"
    >
      <section>
        <div class="showcase">
          <ProfileShowcaseEntry masterpiece />
          <ProfileShowcaseEntry />
          <ProfileShowcaseEntry />
          <ProfileShowcaseEntry />
          <ProfileShowcaseEntry />
          <ProfileShowcaseEntry />
          <ProfileShowcaseEntry />
          <ProfileShowcaseEntry />
          <ProfileShowcaseEntry />
        </div>
        <footer class="paging">
          <div class="icons">
            <Icon name="charm:chevrons-left" />
            <Icon name="charm:chevron-left" />
          </div>
          <div class="page">
            X of XX
          </div>
          <div class="icons">
            <Icon name="charm:chevron-right" />
            <Icon name="charm:chevrons-right" />
          </div>
        </footer>
      </section>
      <template #footer>
        <ScHexaImage
          src="/images/avatar.png"
          :alt="user.displayName"
        />
      </template>
    </ScFloatingPanel>
    <ScFloatingPanel v-else>
      <template #header>
        {{ $t(loading ? 'profile.loading' : 'error.profile.not-found.header') }} <ScLoadingPoints v-if="loading" />
      </template>
      <ScLoadingBar v-if="loading" />
      <div
        v-else
        class="not-found"
      >
        <p>{{ $t('error.profile.not-found.content.line-1') }}</p>
        <p>{{ $t('error.profile.not-found.content.line-2') }}</p>
        <p>{{ $t('error.profile.not-found.content.line-3') }}</p>
        <p>{{ $t('error.profile.not-found.content.line-4') }}</p>
      </div>
    </ScFloatingPanel>
  </LayoutMainCentered>
</template>

<script setup lang="ts">
import type ScribeUser from '~~/models/user/user';

const user = ref<ScribeUser | null>(null);
const loading = ref(true);

const route = useRoute();
onBeforeMount(() => {
  loading.value = true;
  const userUrl = route.params.user;
  // const usersRef = collection(db, 'users');
  // const q = query(usersRef, where('url', '==', userUrl));
  // getDocs(q)
  //   .then(querySnapshot => {
  //     const results = querySnapshot.docs;
  //     if (results.length === 1) {
  //       const result = results[0];
  //       const userData = result.data() as Omit<ScribeUser, 'id'>;
  //       user.value = {
  //         ...userData,
  //         id: result.id
  //       }
  //       loading.value = false;
  //     } else {
  //       throw new Error('Found more or less than one user.')
  //     }
  //   })
  //   .catch(() => {
  //     loading.value = false;
  //   });
})
</script>

<style scoped>
.showcase {
  display: grid;
  grid-template-areas: "masterpiece masterpiece entry-1 entry-2"
                       "masterpiece masterpiece entry-3 entry-4"
                       "entry-5 entry-6 entry-7 entry-8";
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.paging {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.icons {
  display: flex;
  align-items: center;
  font-size: 2em;
  gap: 1rem;
}

.icons > .icon {
  cursor: pointer;
}

.icons > .icon:hover {
  color: var(--color-primary-500);
}

.page {
  display: flex;
  align-items: center;
}

.not-found {
  font-size: 1.25em;
  text-align: center;
  line-height: 1.5;
}
</style>