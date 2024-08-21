<template>
  <v-app>
    <v-main>
      <QnaView />
      <v-container class="mypage-container">
        <v-row justify="center">
          <MypageComponent />
          <v-col cols="9" justify="center">
            <v-card-title class="custom-title">
              <v-text style="font-size : 45px;">Password Change</v-text>
              <p>고객님의 정보를 언제든지 변경할 수 있습니다.</p>
              <v-col>
                <v-card>
                  <v-card-text>
                    <v-row>
    
                      <v-col cols="10" style="background-color: white">
                        <input
                          type="password"
                          v-model="beforePassword"
                          id="beforeInput"
                          placeholder="Current Password"
                          style="width: 50%; padding: 10px; border: 1px solid #69586F; border-radius: 5px;"
                          class="custom-input"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                     
                      <v-col cols="10">
                        <input
                          v-model="afterPassword"
                          type="password"
                          placeholder="New Password"
                          style="width: 50%; padding: 10px; border: 1px solid #69586F; border-radius: 5px;"
                          class="custom-input"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      
                      <v-col cols="10">
                        <input
                          v-model="passwordCheck"
                          type="password"
                          placeholder="Confirm New Password"
                          @input="checkPassword"
                          style="width: 50%; padding: 10px; border: 1px solid #69586F; border-radius: 5px;"
                          class="custom-input"
                        />
                        <p class="messageClass" style="padding-left: 5px;padding-top: 8px; color:#69586F;">{{ message }}</p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <br />
                <v-row class="justify-end text-align: right" style="padding-right: 20px; ">
                  <v-btn @click="passwordUpdate" style="color:#69586F; border: 0.5px solid #69586F;">
                      CHANGE
                  </v-btn>
              </v-row>
              </v-col>
            </v-card-title>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import QnaView from "../QnaView.vue";
import MypageComponent from "@/components/MypageComponent.vue";

export default {
  data() {
    return {
      beforePassword: "",
      afterPassword: "",
      passwordCheck: "",
      message: "비밀번호가 일치하지 않습니다.",
    };
  },
  computed: {
    isCorrect() {
      return this.afterPassword === this.passwordCheck;
    },
  },
  methods: {
    async passwordUpdate() {
      try {
        const token = localStorage.getItem("membertoken");
        // {headers: {Authorization: 'Bearer 토큰 값'}}}
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/member/modify`,
          {
            beforePassword: this.beforePassword,
            afterPassword: this.afterPassword,
          },
          { headers }
        );
        alert("비밀번호가 성공적으로 업데이트되었습니다:", response.data);
      } catch (e) {
        alert(e);
      }
    },
    checkPassword() {
      if (this.isCorrect) {
        this.message = "비밀번호가 일치합니다.";
      } else {
        this.message = "비밀번호가 일치하지 않습니다.";
      }
    },
  },
  components: {
    QnaView,
    MypageComponent,
  },
};
</script>

<style scoped>

.custom-input:focus {
  border-color: #69586F;/* 원하는 색상으로 변경 */
  outline: none;

}

.custom-title {
  font-family: "Noto Serif KR", serif;
  color: #69586F;
  font-size: 20px;
}

.custom-title h1{
  font-family: "Noto Serif KR", serif;
  color: #69586F;
}

.mypage-container {
  background-color: white;
  position: absolute;
  width: 90%;
  max-width: 1200px;
  height: 82%;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  overflow-y: auto;
}

.sidebar {
  border-radius: 10px;
  padding-top: 10px;
  width: 250px;
  height: 80vh;
  background-color: #ded6f4;
  padding: 20px;
  justify-self: center;
}
.v-btn {
  margin: 0;
  font-family: "Noto Serif KR", serif;
  background-color: #FFFFFF;
  
  box-shadow: none !important;
}

.v-btn:hover,
.v-btn:active {
  background: #FFFFFF;
}

.v-btn:visited {
  background: #FFFFFF;
}


.mypage-container input {
  border: 1px solid;
}
.input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
