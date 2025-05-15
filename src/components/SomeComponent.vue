<template>
  <div>
    <p v-if="isLoggedIn">已登录</p>
    <p v-else>未登录</p>
  </div>
</template>

<script>
import { isLoggedIn } from '@/utils/request.js';

export default {
  computed: {
    isLoggedIn() {
      return isLoggedIn();
    }
  }
};
</script>