<template>
  <div class="login-container">
    <!-- 登录模块 -->
    <h1 class="system-title">开源项目的源码解析系统</h1>
    <div class="login-box">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
              type="text"
              id="username"
              v-model="username"
              placeholder="请输入用户名"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="请输入密码"
              required
          />
        </div>

        <button type="submit">登录</button>
        <div class="operation">
          <a @click="handleCreateUser" class="forget-pwd" style="text-align: left;" href="http://localhost:8080/register">注册新账号</a>
          <a class="forget-pwd" style="text-align: right;"href="http://localhost:8080/ForgotPassword">忘记密码？</a>
        </div>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from "@/router/index.js";

const handleCreateUser = () => {
  router.push({name:'register'})
}
export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://127.0.0.1:8080/denglu/', {
          username: this.username,
          password: this.password
        });
        this.message = response.data.message;

        // 保存 token 到 localStorage
        localStorage.setItem('token', response.data.access_token);

        setTimeout(() => {
          localStorage.setItem('token', response.data.access_token);
          this.$router.push({ path: '/Home', query: { user_id: response.data.user_id,token: response.data.access_token } });
        }, 500);
      } catch (error) {
        if (error.response) {
          this.message = error.response.data.detail;
        } else {
          this.message = '登录失败：网络错误';
        }
      }
    },
  },
};
</script>

<style scoped>
/* 系统标题 */
.system-title {
  text-align: center;
  color: #fff;
  font-size: 40px;
  margin-bottom: 60px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* 登录容器 */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../assets/2.jpg");
  margin: 0;
  padding: 0;
}
/* 登录框 */
.login-box {
  width: 100%;
  max-width: 300px;
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
  flex:1;
  margin: 0 auto;
  color: #3d5b96;
  font-size: 18px;
  cursor: pointer;
}
</style>