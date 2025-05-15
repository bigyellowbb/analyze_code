<template>
  <!-- 顶部导航栏 -->
  <div class="konghang"></div>
  <header class="header">
    <!-- 左边标题 -->
    <div class="title">
      开源项目的源码解析系统
    </div>

    <!-- 右边导航栏 -->
    <nav class="nav">
      <router-link to="/Home" class="shouye">首页</router-link>
      <router-link to="/source">源码解析</router-link>
      <router-link to="/profile">个人中心</router-link>
    </nav>
  </header>

  <div class="home-container">
    <!-- 欢迎横幅 -->
<!--    <div class="welcome-banner">-->
<!--      <h1>欢迎来到源码解析系统</h1>-->
<!--      <p>探索、学习和贡献开源项目</p>-->
<!--    </div>-->

    <!-- 热门开源社区展示 -->
    <div class="community-section">
      <h2>热门开源社区</h2>
      <div class="community-grid">
        <!-- GitHub -->
        <div class="community-card" @click="redirectTo('https://github.com')">
          <img src="../assets/github-logo1.png" alt="GitHub" class="community-logo">
          <div class="community-info">
            <h3>GitHub</h3>
            <p>全球最大的开源代码托管平台</p>
          </div>
        </div>

        <!-- GitLab -->
        <div class="community-card" @click="redirectTo('https://gitlab.com')">
          <img src="../assets/gitlab-logo.png" alt="GitLab" class="community-logo">
          <div class="community-info">
            <h3>GitLab</h3>
            <p>完整的DevOps平台，支持自托管</p>
          </div>
        </div>

        <!-- Gitee -->
        <div class="community-card" @click="redirectTo('https://gitee.com')">
          <img src="../assets/gitee-logo.png" alt="Gitee" class="community-logo">
          <div class="community-info">
            <h3>Gitee</h3>
            <p>中国领先的开源代码托管平台</p>
          </div>
        </div>

        <!-- Bitbucket -->
        <div class="community-card" @click="redirectTo('https://bitbucket.org')">
          <img src="https://img.alicdn.com/imgextra/i1/O1CN014B9spq1xrDad6enpX_!!6000000006496-2-tps-240-58.png" alt="Bitbucket" class="community-logo">
          <div class="community-info">
            <h3>阿里巴巴开源</h3>
            <p>全球超过3万开发者为开源开源项目贡献代码</p>
          </div>
        </div>

        <!-- SourceForge -->
        <div class="community-card" @click="redirectTo('https://sourceforge.net')">
          <img src="../assets/sourceforge-logo.png" alt="SourceForge" class="community-logo">
          <div class="community-info">
            <h3>SourceForge</h3>
            <p>老牌开源软件分发平台</p>
          </div>
        </div>

        <!-- Codeberg -->
        <div class="community-card" @click="redirectTo('https://codeberg.org')">
          <img src="../assets/gitcode-logo.png" alt="Codeberg" class="community-logo">
          <div class="community-info">
            <h3>Gitcode</h3>
            <p>CSDN 和华为云CodeArts联合推出新一代AI驱动的开源开发者平台</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色功能区域 -->
    <div class="features-section">
      <h2>系统特色功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="fas fa-code feature-icon"></i>
          <h3>源码解析</h3>
          <p>深入分析热门开源项目架构与实现</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-book feature-icon"></i>
          <h3>学习笔记</h3>
          <p>记录和分享源码阅读心得</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-users feature-icon"></i>
          <h3>社区讨论</h3>
          <p>与其他开发者交流源码理解</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    redirectTo(url) {
      window.open(url, '_blank');
    }
  }
}
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333; /* 灰色背景 */
  color: white; /* 白色字体 */
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
  padding: 20px;
}
.shouye {
  font-weight: bold;
}
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-banner {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #2690fc, #3d5b96);
  color: white;
  border-radius: 10px;
  margin-bottom: 30px;
}

.welcome-banner h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.welcome-banner p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.community-section, .features-section {
  margin-bottom: 50px;
}

.community-section h2, .features-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.community-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.community-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.community-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 15px;
}

.community-info {
  text-align: center;
}

.community-info h3 {
  margin: 10px 0;
  color: #2690fc;
}

.community-info p {
  color: #666;
  font-size: 0.9rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  color: #2690fc;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 15px 0;
  color: #333;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .community-grid, .features-grid {
    grid-template-columns: 1fr;
  }

  .welcome-banner h1 {
    font-size: 2rem;
  }
}
.konghang {
  height: 80px;
}
</style>