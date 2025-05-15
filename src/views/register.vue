<template>
  <div class="register-container">
    <!-- 注册模块 -->
    <div class="register-box">
      <h2>用户注册</h2>
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
              type="text"
              id="username"
              v-model="user.username"
              placeholder="请输入用户名"
              required
          />
        </div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
              type="email"
              id="email"
              v-model="user.email"
              placeholder="请输入邮箱"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="user.password"
              placeholder="请输入密码"
              required
          />
        </div>
        <div class="form-group">
          <label for="phone">手机号</label>
          <input
              type="tel"
              id="phone"
              v-model="user.phone"
              placeholder="请输入11位手机号"
              pattern="[0-9]{11}"
              maxlength="11"
              required
              @input="validatePhone"
          />
        </div>
        <button type="submit">注册</button>
        <div class="operation">
          <a @click="handleLogin" class="forget-pwd" style="text-align: left;" href="http://localhost:8080/login">已有账号？去登录</a>
        </div>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
        phone: '',
      },
      message: '', // 用于显示注册结果消息
      phoneError: '', // 手机号错误提示
      isSubmitting: false // 防止重复提交
    };
  },
  methods: {
    validatePhone() {
      const phoneRegex = /^[0-9]{11}$/;
      if (!phoneRegex.test(this.user.phone)) {
        this.phoneError = '请输入11位数字的手机号';
      } else {
        this.phoneError = '';
      }
    },
    async registerUser() {
      this.validatePhone();
      if (this.phoneError) return;
      this.isSubmitting = true;
      try {
        const response = await axios.post('http://127.0.0.1:8080/register/', this.user);
        this.message = `注册成功！`;
      } catch (error) {
        if (error.response) {
          this.message = `注册失败: ${error.response.data.detail}`;
        } else {
          this.message = '注册失败：网络错误';
        }
      }
    },
    handleLogin() {
      this.$router.push('/login'); // 跳转到登录页面
    },
  },
};
</script>

<style scoped>
/* 全局样式 */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
}

/* 注册容器 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 占满整个屏幕高度 */
  background-image: url("../assets/2.jpg");
  margin: 0; /* 移除默认外边距 */
  padding: 0; /* 移除默认内边距 */
}

/* 注册框 */
.register-box {
  width: 100%;
  max-width: 300px; /* 限制注册框的最大宽度 */
  padding: 60px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-color: #fff;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 30px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #2690fc;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
}

button:hover {
  background-color: #2683fc;
}

.message {
  margin-top: 15px;
  text-align: center;
  color: #ff4d4f;
}

.operation {
  padding-top: 25px;
  display: flex;
  flex-direction: row;
  margin: 0 30px;
}

.forget-pwd {
  display: block;
  overflow: hidden;
  flex: 1;
  margin: 0 auto;
  color: #3d5b96;
  font-size: 18px;
  cursor: pointer;
}
</style>