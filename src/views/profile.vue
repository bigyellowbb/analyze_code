<script>
export default {
  name: "profile",
  data() {
    return {
      userInfo: null,
      loading: true,
      error: null,
      showEditDialog: false,
      editForm: {
        email: '',
        phone: ''
      },
      updating: false
    }
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = '未登录，请先登录';
      this.$router.push('/login');
      return;
    }

    console.log('发起请求...'); // 调试
    try {
      const response = await this.$axios.get('http://127.0.0.1:8080/me');
      console.log('响应数据:', response.data); // 调试

      if (!response.data) {
        throw new Error('响应数据为空');
      }

      this.userInfo = {
        user_id: response.data.user_id || '无',
        username: response.data.username || '无',
        email: response.data.email || '无',
        created_at: response.data.created_at ? response.data.created_at.split('.')[0] : '无',
        phone: response.data.phone || '无'

      };

    } catch (error) {
      console.error('请求出错:', error);
      this.error = error.response?.data?.detail ||
          error.message ||
          '获取用户信息失败';

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    } finally {
      this.loading = false;
      console.log('最终状态:', this.userInfo); // 调试
    }
  },
  methods: {

    async logout() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        // 设置请求头
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // 调用退出登录接口
        await this.$axios.post('http://127.0.0.1:8080/logout', {}, config);

        // 清除本地存储
        localStorage.removeItem('token');

        // 清除 axios 默认授权头
        delete this.$axios.defaults.headers.common['Authorization'];

        // 跳转到登录页
        this.$router.push('/login');

      } catch (error) {
        console.error('退出登录失败:', error);
        this.error = error.response?.data?.detail || '退出登录失败';

        // 如果 token 无效，也强制退出
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      }
    },

    async submitUpdate() {
      this.updating = true;
      try {
        const token = localStorage.getItem('token');
        const response = await this.$axios.patch(
            'http://127.0.0.1:8080/update',
            this.editForm,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
        );

        // 更新本地用户信息
        if (this.editForm.email) {
          this.userInfo.email = this.editForm.email;
        }
        if (this.editForm.phone) {
          this.userInfo.phone = this.editForm.phone;
        }

        this.$message.success(response.data.message);
        this.showEditDialog = false;
      } catch (error) {
        console.error('更新失败:', error);
        this.$message.error(error.response?.data?.detail || '更新失败');
      } finally {
        this.updating = false;
      }
    }
  },
  watch: {
    showEditDialog(newVal) {
      if (newVal) {
        // 打开对话框时填充当前值
        this.editForm = {
          email: this.userInfo.email,
          phone: this.userInfo.phone
        };
      }
    }
  }
}
</script>
<template>
  <div class="profile-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="userInfo" class="user-card">
      <h2>用户信息</h2>
      <div class="info-item">
        <span class="label">用户ID：</span>
        <span class="value">{{ userInfo.user_id }}</span>
      </div>
      <div class="info-item">
        <span class="label">用户名：</span>
        <span class="value">{{ userInfo.username }}</span>
      </div>
      <div class="info-item">
        <span class="label">邮箱：</span>
        <span class="value">{{ userInfo.email }}</span>
      </div>
      <div class="info-item">
        <span class="label">手机号：</span>
        <span class="value">{{ userInfo.phone }}</span>
      </div>
      <div class="info-item">
        <span class="label">注册时间：</span>
        <span class="value">{{ userInfo.created_at }}</span>
      </div>
    </div>
    <div v-else class="error">{{ error || '无法获取用户信息' }}</div>
    <button @click="showEditDialog = true" class="edit-btn">修改信息</button>
    <button @click="logout" class="logout-btn">退出登录</button>
  </div>

  <!-- 编辑对话框 -->
  <div v-if="showEditDialog" class="dialog-overlay">
    <div class="edit-dialog">
      <h3>修改个人信息</h3>
      <form @submit.prevent="submitUpdate">
        <div class="form-group">
          <label>邮箱：</label>
          <input v-model="editForm.email" type="email" placeholder="请输入新邮箱">
        </div>
        <div class="form-group">
          <label>手机号：</label>
          <input v-model="editForm.phone" type="tel" placeholder="请输入新手机号">
        </div>
        <div class="dialog-buttons">
          <button type="button" @click="showEditDialog = false" class="cancel-btn">取消</button>
          <button type="submit" :disabled="updating" class="confirm-btn">
            {{ updating ? '更新中...' : '确认更新' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.user-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.info-item {
  margin: 15px 0;
  font-size: 16px;
}

.label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
  color: #34495e;
}

.value {
  color: #7f8c8d;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #e74c3c;
}

.logout-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.edit-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.edit-btn:hover {
  background-color: #45a049;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.edit-dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.edit-dialog h3 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn {
  padding: 8px 16px;
  margin-right: 10px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}


</style>