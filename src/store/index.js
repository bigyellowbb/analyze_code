import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  // 定义状态，用于存储应用中的数据
  state: {
    // 用户信息，初始值为 null
    user: null
  },
  // 定义 mutations，用于修改 state 中的数据，且必须是同步操作
  mutations: {
    /**
     * 设置用户信息
     * @param {Object} state - 当前的状态对象
     * @param {Object} user - 用户信息对象，包含 id 和 username
     */
    setUser(state, user) {
      state.user = user;
    },
    /**
     * 清除用户信息
     * @param {Object} state - 当前的状态对象
     */
    clearUser(state) {
      state.user = null;
    }
  },
  // 定义 getters，用于获取 state 中的数据，类似于计算属性
  getters: {
    /**
     * 获取当前用户信息
     * @param {Object} state - 当前的状态对象
     * @returns {Object|null} - 当前用户信息，如果未登录则为 null
     */
    currentUser: (state) => state.user
  },
  // 定义 actions，用于处理异步操作，最终通过提交 mutations 来修改 state
  actions: {
    /**
     * 登录操作
     * @param {Object} context - 上下文对象，包含 commit 方法等
     * @param {Object} credentials - 用户登录凭证，包含 username 和 password
     */
    async login(context, credentials) {
      try {
        // 调用登录接口
        const response = await axios.post('http://127.0.0.1:8080/denglu/', credentials);
        // 保存用户信息到 state
        context.commit('setUser', {
          id: response.data.user_id,
          username: credentials.username
        });
        // 保存 token 到 localStorage
        localStorage.setItem('access_token', response.data.access_token);
        return response;
      } catch (error) {
        throw error;
      }
    },
    /**
     * 注销操作
     * @param {Object} context - 上下文对象，包含 commit 方法等
     */
    logout(context) {
      // 清除用户信息
      context.commit('clearUser');
      // 移除 localStorage 中的 token
      localStorage.removeItem('access_token');
    }
  }
});