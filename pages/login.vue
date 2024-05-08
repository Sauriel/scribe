<template>
  <LayoutMainCentered>
    <ScFloatingPanel>
      <template #header>
        <span
          class="header"
          :class="{
            'active': !showRegister
          }"
          @click="onLoginTitleClick"
        >{{ $t('login-register.title.login') }}</span>
        <span class="separator">|</span>
        <span
          class="header"
          :class="{
            'active': showRegister
          }"
          @click="onRegisterTitleClick"
        >{{ $t('login-register.title.register') }}</span>
      </template>
      <section
        class="selection-screen"
      >
        <TransitionGroup
          name="form"
          tag="div"
          class="form"
          :class="{
            'register': showRegister
          }"
        >
          <ScFormInput
            id="email"
            key="email"
            ref="emailInput"
            v-model="email"
            type="email"
            required
            :placeholder="$t('login-register.form.email.placeholder')"
            :label="$t('login-register.form.email.label')"
            :pattern="REGEX.EMAIL"
            :error-msg="$t('login-register.form.email.error')"
          />
          <ScFormInput
            v-if="showRegister"
            id="name"
            key="name"
            ref="nameInput"
            v-model="name"
            required
            :placeholder="$t('login-register.form.name.placeholder')"
            :label="$t('login-register.form.name.label')"
          />
          <VIfTransitionHydrationFix v-else />
          <ScFormInput
            id="password"
            key="password"
            ref="passwordInput"
            v-model="password"
            type="password"
            required
            :placeholder="$t('login-register.form.password.placeholder')"
            :label="$t('login-register.form.password.label')"
            :pattern="REGEX.PASSWORD"
            :error-msg="$t('login-register.form.password.error')"
            :on-validation-callback="checkPasswordStrength"
          />
          <ScFormInput
            v-if="showRegister"
            id="repeatPassword"
            key="repeatPassword"
            ref="repeatPasswordInput"
            v-model="repeatPassword"
            type="password"
            required
            :placeholder="$t('login-register.form.repeatPassword.placeholder')"
            :label="$t('login-register.form.repeatPassword.label')"
            :error-msg="$t('login-register.form.repeatPassword.error')"
            :validate-fn="isRepeatedPasswordCheck"
          />
          <VIfTransitionHydrationFix v-else />
          <div
            v-if="!showRegister"
            key="remember-and-forgotten"
            class="remember-and-forgotten"
          >
            <ScCheckbox v-model="remember">
              {{ $t('login-register.form.rememberMe.label') }}
            </ScCheckbox>
            <a href="#">
              {{ $t('login-register.form.passwordForgotten') }}
            </a>
          </div>
          <VIfTransitionHydrationFix v-else />
          <ScBtn
            key="submit-login"
            :disabled="disableButton"
            @click="onLoginRegisterClick"
          >
            {{ $t(`login-register.form.submit.${showRegister ? 'register' : 'login'}`) }}
          </ScBtn>
        </TransitionGroup>
        <div class="info-wrapper">
          <div class="info-block">
            <span
              v-if="!showRegister"
              class="text"
            >
              {{ $t('login-register.info.login.text') }}
            </span>
            <div v-else>
              <header class="password-hints-header">
                {{ $t('login-register.info.register.text') }}
              </header>
              <ul class="password-hints">
                <li
                  :class="{
                    'success': lengthOK
                  }"
                >
                  <Icon :name="lengthOK ? 'ion:md-checkmark-circle-outline' : 'ion:md-close-circle-outline'" />
                  {{ $t('login-register.form.password.hint.length') }}
                </li>
                <li
                  :class="{
                    'success': lowercaseOK
                  }"
                >
                  <Icon :name="lowercaseOK ? 'ion:md-checkmark-circle-outline' : 'ion:md-close-circle-outline'" />
                  {{ $t('login-register.form.password.hint.lowercase') }}
                </li>
                <li
                  :class="{
                    'success': uppercaseOK
                  }"
                >
                  <Icon :name="uppercaseOK ? 'ion:md-checkmark-circle-outline' : 'ion:md-close-circle-outline'" />
                  {{ $t('login-register.form.password.hint.uppercase') }}
                </li>
                <li
                  :class="{
                    'success': numberOK
                  }"
                >
                  <Icon :name="numberOK ? 'ion:md-checkmark-circle-outline' : 'ion:md-close-circle-outline'" />
                  {{ $t('login-register.form.password.hint.number') }}
                </li>
                <li
                  :class="{
                    'success': specialOK
                  }"
                >
                  <Icon :name="specialOK ? 'ion:md-checkmark-circle-outline' : 'ion:md-close-circle-outline'" />
                  {{ $t('login-register.form.password.hint.special') }}
                </li>
              </ul>
            </div>
            <ScBtn
              secondary
              @click="onToggleRegisterClick"
            >
              {{ $t(`login-register.info.${showRegister ? 'register' : 'login'}.button`) }}
            </ScBtn>
            <section
              v-if="!showRegister"
              class="social-logins"
            >
              <header>Or sign in with your social profile.</header>
              <div class="third-party-providers">
                <ScIconBtn
                  icon="fa6-brands:google"
                  secondary
                  color="#4285F4"
                  @click="signInWithGoogle"
                />
                <ScIconBtn
                  icon="fa6-brands:apple"
                  secondary
                  :color="mode === 'light' ? '#000' : '#FFF'"
                  invert-hover-color
                  @click="signInWithApple"
                />
                <ScIconBtn
                  icon="fa6-brands:facebook-f"
                  secondary
                  color="#4267B2"
                  @click="signInWithFacebook"
                />
                <ScIconBtn
                  icon="fa6-brands:twitter"
                  secondary
                  color="#1DA1F2"
                  @click="signInWithTwitter"
                />
                <ScIconBtn
                  icon="fa6-brands:discord"
                  secondary
                  color="#7289DA"
                  @click="signInWithDiscord"
                />
                <ScIconBtn
                  icon="fa6-brands:twitch"
                  secondary
                  color="#9146FF"
                  @click="signInWithTwitch"
                />
                <ScIconBtn
                  icon="fa6-brands:github"
                  secondary
                  :color="mode === 'light' ? '#333' : '#FFF'"
                  invert-hover-color
                  @click="signInWithGithub"
                />
              </div>
            </section>
          </div>
        </div>
      </section>
    </ScFloatingPanel>
  </LayoutMainCentered>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/theme';
import REGEX from '@/utils/regex';
import type InputElement from '@/components/sc/formInput/formInput.vue';

definePageMeta({ middleware: 'login-redirect' })

const router = useRouter();
const encryption = useEncryption();
const { $bus } = useNuxtApp();
const { signIn, signOut, session, status, cookies } = useAuth();
const themeStore = useThemeStore();

const emailInput = ref<typeof InputElement>();
const nameInput = ref<typeof InputElement>();
const passwordInput = ref<typeof InputElement>();
const repeatPasswordInput = ref<typeof InputElement>();

const showRegister = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');
const repeatPassword = ref('');
const remember = ref(true);
const lengthOK = ref(false);
const lowercaseOK = ref(false);
const uppercaseOK = ref(false);
const numberOK = ref(false);
const specialOK = ref(false);

const mode = computed(() => themeStore.mode);

const disableButton = computed<boolean>(() => {
  const emailInvalid = emailInput.value?.isInvalid ?? false;
  const passwordInvalid = passwordInput.value?.isInvalid ?? false;
  if (showRegister.value) {
    const nameInvalid = nameInput.value?.isInvalid ?? false;
    const repeatPasswordInvalid = repeatPasswordInput.value?.isInvalid ?? false;
    return emailInvalid || nameInvalid || passwordInvalid || repeatPasswordInvalid;
  } else {
    return emailInvalid || passwordInvalid;
  }
});

function signInWithGithub() {
  signIn('github');
}

function signInWithGoogle() {
  signIn('google');
}

function signInWithApple() {
  signIn('apple');
}

function signInWithDiscord() {
  signIn('discord');
}

function signInWithFacebook() {
  signIn('facebook');
}

function signInWithTwitter() {
  signIn('twitter');
}

function signInWithTwitch() {
  signIn('twitch');
}

function signInWithCredentials(email: string, password: string, remember: boolean) {
  signIn('credentials', { email, password, remember });
}

function onLoginRegisterClick() {
  const encryptedPassword = encryption.hashString(password.value);
  if (showRegister.value) {
    // createUserWithEmailAndPassword(auth!, email.value, encryptedPassword)
    //   .then(userCredentials => {
    //     const displayName = name.value;
    //     const urlName = useReplace(useDeburr(displayName.toLowerCase()), ' ', '-');
    //     // ToDo [2023-07-30] check if urlName already exists, maybe generate a 6 dixit a-z0-9 identifier
    //     const userData: Omit<ScribeUser, 'id'> = {
    //       displayName: displayName,
    //       url: urlName
    //     };
    //     return setDoc(
    //       doc(db, 'users', userCredentials.user.uid),
    //       userData,
    //       { merge: true }
    //     )
    //     .then(() => urlName);
    //   })
    //   .then((urlName) => router.push(`/${urlName}/profile`))
    //   .catch((error: FirebaseError) => {
    //     $bus.emit('toast:show', {
    //       type: 'alert',
    //       message: getErrorMessage(error)
    //     });
    //   });
  } else {
    signInWithCredentials(email.value, encryptedPassword, remember.value);
    // signInWithEmailAndPassword(auth!, email.value, encryptedPassword)
    //   .then(userCredentials => useDocument(doc(db, 'users', userCredentials.user.uid)).promise.value)
    //   .then(userDoc => router.push(`/${userDoc?.url}/profile`))
    //   .catch((error: FirebaseError) => {
    //     $bus.emit('toast:show', {
    //       type: 'alert',
    //       message: getErrorMessage(error)
    //     });
    //   });
  }
}

function onToggleRegisterClick() {
  showRegister.value = !showRegister.value;
}

function onLoginTitleClick() {
  showRegister.value = false;
}

function onRegisterTitleClick() {
  showRegister.value = true;
}

function checkPasswordStrength(model: string) {
  lengthOK.value = REGEX.PASSWORD_HINTS.HAS_LENGTH.test(model);
  lowercaseOK.value = REGEX.PASSWORD_HINTS.HAS_LOWERCASE.test(model);
  uppercaseOK.value = REGEX.PASSWORD_HINTS.HAS_UPPERCASE.test(model);
  numberOK.value = REGEX.PASSWORD_HINTS.HAS_NUMBER.test(model);
  specialOK.value = REGEX.PASSWORD_HINTS.HAS_SPECIAL.test(model);
}

function isRepeatedPasswordCheck(model: string): boolean {
  return model === password.value;
}
</script>

<style scoped>
.header:not(.active) {
  color: var(--color-foreground-800);
  cursor: pointer;
}

.header:not(.active):hover {
  color: var(--color-foreground-700);
}

.separator {
  color: var(--color-primary-400);
  margin: 0 0.25ch;
  font-weight: 400;
}
.selection-screen {
  display: grid;
  grid-template-areas: "form info";
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.selection-screen::v-deep(> .form) {
  grid-area: form;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 18em;
  height: 18em;
  max-height: 18em;
  transition: all var(--animation);
  overflow-y: hidden;
}

.selection-screen::v-deep(> .form).register {
  min-height: 28em;
  height: 28em;
  max-height: 28em;
}

.remember-and-forgotten {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-wrapper {
  padding-top: calc(14px + 0.2em);
}

.info-block {
  grid-area: info;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--color-background-600);
  padding: 1em;
  border-radius: var(--border-radius);
  height: 100%;
}

.info-block .text {
  font-size: 1em;
}

.form-enter-active,
.form-leave-active {
  transition: all var(--animation);
}
.form-enter-from,
.form-leave-to {
  opacity: 0;
  z-index: -1;
  min-height: 0;
  height: 0;
  max-height: 0;
}

.password-hints-header {
  font-weight: bold;
  margin-bottom: 1em;
  font-size: 1.2em;
}

.password-hints {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  animation: showPasswordHints var(--animation) forwards;
  font-size: 0.75em;
}

.password-hints > li {
  display: flex;
  gap: 1ch;
  align-items: center;
  color: var(--color-alert-500);
  transition: color var(--animation);
}

.password-hints > li.success {
  color: var(--color-success-500);
}

.password-hints > li > .icon {
  flex: 0 0 auto;
  font-size: 1.6em;
}

@keyframes showPasswordHints {
  from {
    opacity: 0;
    height: 0;
  }
  to {
    opacity: 1;
    height: 160px;
  }
}

.social-logins {
  display: flex;
  flex-direction: column;
  gap: 1em;
  font-size: 0.7em;
  border-top: 1px solid var(--color-foreground-500);
  padding-top: 0.5em;
}

.third-party-providers {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}
</style>