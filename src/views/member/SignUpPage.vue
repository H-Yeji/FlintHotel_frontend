<template>
  <div>
    <FlintView />
    <!-- 회원가입 폼 -->
    <!-- <v-main class="main-background"> -->
      <v-container class="join-now-container">
        <v-row>
          <v-col cols="12">
            <h1 class="join-now-title">JOIN NOW</h1>
            <p class="korFont">플린트호텔에 오신 것을 환영합니다.</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-form @submit.prevent="SignUp">
              <v-text-field 
                label="EMAIL *" 
                v-model="email"
                type="email"
                required
              ></v-text-field>
              <v-text-field 
                label="PASSWORD *" 
                v-model="password"
                type="password"
                required
              ></v-text-field>
              <v-text-field 
                label="FIRST NAME *" 
                v-model="firstName"
                required
              ></v-text-field>
              <v-text-field 
                label="LAST NAME *" 
                v-model="lastName"
                required
              ></v-text-field>
            </v-form>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field 
              label="BIRTHDAY" 
              v-model="birthday"
              placeholder="YYYY-MM-DD"
              required
              @click="showCalendar()"
            ></v-text-field>
            <v-calendar
              v-model="selectedDate" 
              class="calendar"
              :attributes="calendarAttributes"
              is-range
              is-month-picker
              :style="{ width: '380px', height: '270px', borderRadius: '7px', display:'none'}"
              @dayclick="handleDateChange">
            </v-calendar>
            <v-text-field 
              label="PHONE NUMBER *" 
              v-model="phoneNumber"
              required
            ></v-text-field>
            <v-text-field 
              label="NATION *" 
              v-model="nation"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn @click="SignUp" class="emailBtn" style="font-size: 15px;">이메일 인증하기</v-btn>
          </v-col>
        </v-row>
        <EmailVerifyModal
          v-model="emailVerify"
          :emailProp="email"
        >
        </EmailVerifyModal>
      </v-container>
    <!-- </v-main> -->
  </div>
</template>

<script>
import axios from '@/axios'
// import axios from 'axios'
import { ref } from 'vue'
import EmailVerifyModal from './EmailVerifyModal.vue'
import FlintView from '@/views/FlintView.vue';

export default {
  components: {
    EmailVerifyModal,
    FlintView
  },
  setup() {
    const email = ref('')
    const password = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const birthday = ref('')
    const phoneNumber = ref('')
    const nation = ref('')
    const emailVerify = ref(false)

    const SignUp = async () => {
      // 입력값이 모두 채워져 있는지 확인
      if (!email.value || !password.value || !firstName.value || !lastName.value || !birthday.value || !phoneNumber.value || !nation.value) {
        alert("입력하지 않은 사항이 있습니다.")
        return
      }

      try {
        const signUpData = {
          email: email.value,
          password: password.value,
          firstName: firstName.value,
          lastName: lastName.value,
          birthday: birthday.value,
          phoneNumber: phoneNumber.value,
          nation: nation.value,
        }
        await axios.post(`/member/signup`, signUpData)
        alert("회원님의 이메일로 인증 코드가 전송되었습니다. 인증 코드를 입력하시면 회원 가입이 완료됩니다!")
        emailVerify.value = true 
      } catch (error) {
        console.log("hee")
        console.log(error)
        alert(error.response ? error.response.data.error_message : error.message)
      } 
    }

    const showCalendar = () => {
      const element = document.getElementsByClassName('calendar');
      element[0].style.display = 'block';
    }

    const handleDateChange = (date) => {
      birthday.value = date.id

      const element = document.getElementsByClassName('calendar');
      element[0].style.display = 'none';
    }


    return {
      email,
      password,
      firstName,
      lastName,
      birthday,
      phoneNumber,
      nation,
      emailVerify,
      SignUp,
      showCalendar,
      handleDateChange
    }
  },
}
</script>

<style scoped>
  .join-now-container {
    font-family: 'Playfair Display', serif;
    background-color: white;
    position: absolute;
    width: 90%;
    max-width: 1200px;
    height: 82%;
    top: 50%;
    left: 50%;
    padding: 20px;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow-y: auto;
  }
.korFont {
  font-family: "Noto Serif KR", serif;
}
.emailBtn {
  font-family: "Noto Serif KR", serif;
  background-color: #7A6C5B;
  color: white;
  margin-left: 85%;
}
</style>
