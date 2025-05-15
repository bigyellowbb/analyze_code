<template>
  <div class="forgot-password-container">
    <!-- 忘记密码模块 -->
    <div class="forgot-password-box">
      <h2>忘记密码</h2>
      <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label for="phone">手机号</label>
          <input
              type="text"
              id="phone"
              v-model="phone"
              placeholder="请输入手机号"
              required
          />
        </div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
              type="email"
              id="email"
              v-model="email"
              placeholder="请输入邮箱"
              required
          />
        </div>
        <button type="submit">找回密码</button>
        <div class="operation">
          <a @click="handleLogin" class="forget-pwd" style="text-align: left;" href="http://localhost:8080/login">返回登录</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 引入 Element Plus 的弹窗组件

export default {
  data() {
    return {
      phone: '',
      email: '',
    };
  },
  methods: {
    async handleForgotPassword() {
      try {
        const response = await axios.post('http://127.0.0.1:8080/ForgotPassword/', {
          phone: this.phone,
          email: this.email,
        });

        // 找回密码成功，显示密码
        ElMessage.success({
          message: `密码找回成功！您的密码是：${response.data.password}`,
          duration: 5000, // 弹窗显示时间（毫秒）
        });

        // 延迟 2 秒后跳转到登录页面
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        // 找回密码失败，显示错误信息
        if (error.response) {
          ElMessage.error({
            message: error.response.data.detail || '手机号或邮箱不正确',
            duration: 5000,
          });
        } else {
          ElMessage.error({
            message: '找回密码失败：网络错误',
            duration: 5000,
          });
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

/* 忘记密码容器 */
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 占满整个屏幕高度 */
  background-image: url("../assets/2.jpg");
  margin: 0; /* 移除默认外边距 */
  padding: 0; /* 移除默认内边距 */
}

/* 忘记密码框 */
.forgot-password-box {
  width: 100%;
  max-width: 300px; /* 限制忘记密码框的最大宽度 */
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