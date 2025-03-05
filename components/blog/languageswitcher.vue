<template>
  <select v-model="selectedLanguage" @change="changeLanguage">
    <option v-for="lang in languages" :key="lang.code" :value="lang.code">
      {{ lang.name }}
    </option>
  </select>
</template>

<script setup>
import { useLang } from "@/composables/useLang";
import { ref } from "vue";

const { locale, switchLanguage } = useLang();
const selectedLanguage = ref(locale.value);

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
];

const changeLanguage = () => {
  switchLanguage(selectedLanguage.value);
};
</script>
