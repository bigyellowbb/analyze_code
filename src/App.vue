<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="header" v-if="$route.meta.showHeader !== false">
      <!-- 左边标题 -->
      <div class="title">
        开源项目的源码解析系统
      </div>

      <!-- 右边导航栏 -->
      <nav class="nav">
        <router-link to="/Home">
          <i class="fas fa-home"></i> 首页
        </router-link>
        <router-link to="/source">
          <i class="fas fa-code"></i> 源码解析
        </router-link>
        <router-link to="/profile">
          <i class="fas fa-user"></i> 个人中心
        </router-link>
      </nav>
    </header>

    <!-- 页面内容 -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$axios.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });
  }
};
</script>

<style>
/* 全局样式 */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333; /* 灰色背景 */
  color: white; /* 白色字体 */
  position: fixed; /* 固定在顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保导航栏在最上层 */
  height: 60px; /* 设置导航栏高度 */
}

/* 左边标题 */
.title {
  font-size: 30px;
  font-weight: bold;
  padding-left: 10px;
}

/* 右边导航栏 */
.nav {
  display: flex;
  gap: 40px; /* 导航项之间的间距 */
}

.nav a {
  color: white; /* 白色字体 */
  text-decoration: none; /* 去掉下划线 */
  font-size: 25px;
  padding-right: 30px;
}

.nav a:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}

/* 页面内容 */
.content {
  flex: 1;
  padding-top: 60px; /* 为导航栏留出空间，与导航栏高度一致 */
  padding-left: 20px;
  padding-right: 20px;
}
</style>