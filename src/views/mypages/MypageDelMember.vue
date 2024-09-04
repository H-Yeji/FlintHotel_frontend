<template>
  <v-app>
    <v-main>
      <QnaView />
      <v-container class="mypage-container">
        <v-row justify="center">
          <MypageComponent />
          <v-col cols="9" justify="center">
            <v-card-title class="custom-title">
              <v-text style="font-size : 38px;">Account Deletion</v-text>
              <p style="font-size: 18px;"> {{ memberName }} 님의 정보를 안전하게 보호하기 위해 비밀번호를 다시
                한번 확인합니다.</p>
                <v-card style="width:90%;">
                  <v-card-text style="padding-top : 50px">
                    <v-row>
                      <v-col cols="2" style="font-size: 18px;"> ID</v-col>
                      <v-col cols="10" style="font-size: 18px;">
                        {{ memberEmail }}
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2"  style="font-size: 18px;"> PassWord </v-col>
                      <v-col cols="10">
                        <input v-model="password" type="password" style="width: 30%; padding: 5px; border: 1px solid #69586F; border-radius: 5px;" />
                      </v-col>
                    </v-row>
                    
                  </v-card-text>
                </v-card>
                <v-row class="justify-end text-align: right" style="padding-right: 100px; padding-top: 25px; padding-bottom: 20px;">
                  <v-btn @click="memberDelete()" style="color:#69586F; border: 0.5px solid #69586F; font-size: 15px;">
                      CONFIRM
                  </v-btn>
              </v-row>
            </v-card-title>
           
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MypageComponent from "@/components/MypageComponent.vue";
import QnaView from "../QnaView.vue";
import axios from "axios";

export default {
  components: {
    QnaView,
    MypageComponent,
  },
  date() {
    return {
      password: "",
      memberEmail: "",
      memberName: "",

    };
  },
  created() {
    this.memberEmail = localStorage.getItem("memberEmail")
    this.memberName = localStorage.getItem("memberName");
  },
  methods: {
    async memberDelete() {
      console.log("hi");
      try {
        const token = localStorage.getItem("membertoken");
        const headers = { Authorization: `Bearer ${token}` };
        console.log(this.password)
        await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member/delete`,
          this.password,
          {
            // password 를 단순한 String 평문으로 Server 에 던저주기 위한 설정.
            headers: {
              ...headers,
              'Content-Type': 'text/plain' // Content-Type을 text/plain으로 설정
            }
          });
        alert("탈퇴 완료되었습니다.")
        localStorage.clear()
        this.$router.push({ name: "Flint" });
      } catch (e) {
        console.log("비어있음");
      }
    }
  },
}
</script>

<style scoped>
.v-card-title {
  color: #5e3701;
  /* 이미지에서 보여지는 색깔 */
}

.custom-divider {
  background-color: rgba(0, 0, 0, 1);
  /* 완전한 black 색상 */
  height: 4px;
  /* v-divider의 두께를 더 두껍게 설정 */
  opacity: 1;
}

.custom-title {
  font-family: "Noto Serif KR", serif;
  color: #69586F;
  font-size: 20px;
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

.v-card-title {
  padding: 0;
  margin: 0;
}

.v-btn {
  margin: 0;
  font-family: "Playfair Display", serif;
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

