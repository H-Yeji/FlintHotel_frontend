<template>
  <v-app>
    <v-main>
      <QnaView />
      <v-container class="mypage-container">
        <v-row justify="center">
          <MypageComponent />
          <v-col cols="9" justify="center">
            <v-card-title class="custom-title">
              <div style="padding-top: 45px;">
                <v-text style="font-size : 38px;">My Infomation</v-text><br><br>
                <v-divider class="custom-divider" style=" width: 700px ;"></v-divider>
                <br>
              </div> 
              <ul style="padding-top: 10px;">
                <li style="padding-bottom: 20px; color:#69586F;"> NAME : &nbsp;{{ memberDetail.lastName + memberDetail.firstName }}  </li>
                <li style="padding-bottom: 20px; color:#69586F;"> ID : &nbsp;{{ memberDetail.email }}</li>
                <li style="padding-bottom: 20px; color:#69586F;"> BIRTHDAY :&nbsp; {{ memberDetail.birthday }}</li>
                <li style="padding-bottom: 20px; color:#69586F;"> NATIONAL :&nbsp;{{ memberDetail.nation }}</li>
                <li style="padding-bottom: 20px; color:#69586F;"> PH Number :&nbsp; {{ memberDetail.phoneNumber }}</li>
              </ul>
              
            </v-card-title>
            <div style="padding-top: 20px;">
              <br>
                <v-divider class="custom-divider" style=" width: 700px ;"></v-divider>
                <br>
            </div> 
            <div  style="text-align: right; padding-right:177px; font-family: Noto Serif KR, serif; color:#69586F">저희 FLINT HOTEL에 오신걸 환영합니다.</div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
import MypageComponent from '@/components/MypageComponent.vue';
import QnaView from '../QnaView.vue';
import axios from 'axios';

export default {
  data() {
    return {
      memberDetail: [],
    }
  },
  components: {
    MypageComponent,
    QnaView,
  },
  async created() {
    try {
      const token = localStorage.getItem('membertoken');
      // {headers: {Authorization: 'Bearer 토큰 값'}}}
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member/detail`, { headers });
      this.memberDetail = response.data.result
      console.log(this.memberDetail)
    } catch (e) {
      console.log("비어있음")
    }
  },
}
</script>

<style scoped>
.v-card-title {
  color: #69586F;
  /* 이미지에서 보여지는 색깔 */
}

.custom-divider {
  background-color:#69586F;
  /* 완전한 black 색상 */
  height: 1px;
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
  font-family: "Noto Serif KR", serif;
  background-color: #69586F;
  border: none !important;
  box-shadow: none !important;
}

.v-btn:hover,
.v-btn:active {
  background: #69586F;
}

.v-btn:visited {
  background: #69586F;
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
