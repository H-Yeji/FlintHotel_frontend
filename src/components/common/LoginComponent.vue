<template>
  <div>
    <div class="login-form">
      <h1 class="title">FLINT</h1>
      <input v-model="email" type="text" placeholder="Email" class="input-field">
      <input v-model="password" type="password" placeholder="Password" class="input-field">
      <button @click="login" class="login-button">LOGIN</button>
      <div class="links">
        <a v-if="showFindId" @click.prevent="openFindEmailModal" class="link">FIND ID</a>
        <a @click.prevent="openFindPasswordModal" class="link">FIND PWD</a>
        <a v-if="showJoinLink" :href="joinLink" class="link">JOIN</a>
      </div>
    </div>
    <FindEmailModal v-model="dialog1" @close="closeFindEmailModal" :findEmailEndpoint="findEmailEndpoint" />
    <FindPasswordModal v-model="dialog2" @close="closeFindPasswordModal" :findPasswordEndpoint="findPasswordEndpoint" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FindEmailModal from './FindEmailModal.vue'
import FindPasswordModal from './FindPasswordModal.vue'
import axios from 'axios'

export default {
  name: 'LoginComponent',
  components: {
    FindEmailModal,
    FindPasswordModal,
  },
  props: {
    showFindId: {
      type: Boolean,
      default: true,
    },
    showJoinLink: {
      type: Boolean,
      default: true,
    },
    findEmailEndpoint: {
      type: String,
      required: true,
    },
    findPasswordEndpoint: {
      type: String,
      required: true,
    },
    loginEndpoint: {
      type: String,
      required: true,
    },
    tokenName: {
      type: String,
      required: true,
    },
    joinLink: {
      type: String,
      default: '/member/signup',
    },
    redirectPath: {
      type: String,
      default: '/',  // 기본값은 메인 페이지
    }
  },
  setup(props) {
    const email = ref('')
    const password = ref('')
    const dialog1 = ref(false)
    const dialog2 = ref(false)
    const router = useRouter()

    const login = async () => {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}props.loginEndpoint`, {
          email: email.value,
          password: password.value,
        })
        localStorage.clear();
        const token = response.data.result[props.tokenName]
        localStorage.setItem(props.tokenName, token)
        alert(response.data.status_message)
        // 로그인 성공 시 설정된 경로로 리다이렉트
        router.push(props.redirectPath)
      } catch (error) {
        alert(error.response ? error.response.data.error_message : error.message)
      }
    }

    const openFindEmailModal = () => {
      dialog1.value = true
    }

    const closeFindEmailModal = () => {
      dialog1.value = false
    }

    const openFindPasswordModal = () => {
      dialog2.value = true
    }

    const closeFindPasswordModal = () => {
      dialog2.value = false
    }

    return {
      email,
      password,
      login,
      dialog1,
      dialog2,
      openFindEmailModal,
      closeFindEmailModal,
      openFindPasswordModal,
      closeFindPasswordModal,
    }
  },
}
</script>

<style scoped>
/* 기존 스타일 유지 */
.login-form {
  font-family: "Playfair Display", serif;
  width: 100% !important;
  /* 너비 80% */
  max-width: 700px !important;
  /* 최대 너비 400px */
  padding: 20px;
  /* 내부 여백 20px */
  border-radius: 8px;
  /* 테두리 둥글게 */
  display: flex;
  /* Flexbox 사용 */
  flex-direction: column;
  /* 세로 정렬 */
  align-items: center;
  /* 가로 가운데 정렬 */
}

.title {
  font-size: 2em;
  /* 글꼴 크기 2em */
  margin-bottom: 20px;
  /* 아래 여백 20px */
  color: #8F7598;
  /* 글꼴 색상 */
}

.input-field {
  width: 100%;
  /* 너비 100% */
  padding: 10px;
  /* 내부 여백 10px */
  margin: 10px 0;
  /* 상하 여백 10px */
  border: 1px solid #ccc;
  /* 테두리 */
  border-radius: 4px;
  /* 테두리 둥글게 */
}

.login-button {
  width: 100%;
  /* 너비 100% */
  padding: 10px;
  /* 내부 여백 10px */
  margin-top: 10px;
  /* 상단 여백 10px */
  background-color: #8F7598;
  /* 배경색 */
  color: white;
  /* 글자색 */
  border: none;
  /* 테두리 없음 */
  border-radius: 4px;
  /* 테두리 둥글게 */
  cursor: pointer;
  /* 커서 포인터 모양 */
}

.login-button:hover {
  background-color: #8F7598;
  /* 배경색 유지 */
}

.links {
  margin-top: 10px;
  /* 상단 여백 10px */
  display: flex;
  /* Flexbox 사용 */
  justify-content: center;
  /* 가운데 정렬 */
}

.link {
  margin: 0 5px;
  /* 좌우 여백 5px */
  color: #8F7598;
  /* 글꼴 색상 */
  text-decoration: none;
  /* 밑줄 없음 */
  font-size: 14px;
  /* 글꼴 크기 14px */
}

.link:hover {
  text-decoration: underline;
  /* 호버 시 밑줄 표시 */
}
</style>
