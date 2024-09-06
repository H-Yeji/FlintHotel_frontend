<template>
  <v-col cols="3" align-self="center">
    <v-row class="sidebar" style="padding-top: 250px;">
        <ul>
          <li style="padding-bottom: 10px;">
            <v-btn class="custom-size" :to="{ path: '/mypage/dining' }"
            style="color:#69586F; font-size: 16px; ">Dining</v-btn
            >
          </li>
          <li style="padding-bottom: 10px;">
            <v-btn class="custom-size" :to="{ path: '/mypage/room' }" style="color:#69586F; font-size: 16px;"
              >Room</v-btn
            >
          </li>
          <li style="padding-bottom: 10px;">
            <v-btn class="custom-size" :to="{path:'/mypage/updatepassword'}"  style="color:#69586F; font-size: 16px;">Pw Change</v-btn
            >
          </li>
          <li style="padding-bottom: 10px;">
            <v-btn class="custom-size" @click="$router.push('/mypage/qna/list')" style="color:#69586F; font-size: 16px;">Inquiry</v-btn>
          </li>
          <li style="padding-bottom: 10px;">
            <v-btn class="custom-size" 
              :to="{path:'/mypage/delmember'}"
               style="color:#69586F; font-size: 16px; "
            >Withdrawel</v-btn>
          </li>
        </ul>
    </v-row>
  </v-col>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  data() {
    return {
      memberDetail: [],
    };
  },
  async created() {
    try {
      const token = localStorage.getItem('membertoken');
      // {headers: {Authorization: 'Bearer 토큰 값'}}}
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member/detail`, { headers });
      this.memberDetail = response.data.result
      localStorage.setItem('memberEmail', this.memberDetail.email)
      localStorage.setItem('memberName', this.memberDetail.firstName + " " + this.memberDetail.lastName);
    } catch (e) {
      alert(e.response ? e.response.data.error_message : e.message)
      console.log("비어있음")
    }
  },
  methods: {},
};
</script>

<style scoped>
html,
body,
#app,
.v-application--wrap {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevents overall page scrolling */
}

.background-image {
  background-image: url("@/assets/image.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.custom-title h2,
ul li {
  font-family: "Noto Serif KR", serif;
  
}

.reserve-container {
  background-color: white;
  position: absolute;
  width: 90%;
  max-width: 1200px;
  height: 80%;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  overflow-y: auto;
}

.reservation-content h1 {
  margin-top: 50px;
  color: #787878;
  font-family: "Noto Serif KR", serif;
  font-optical-sizing: auto;
}

.reservation-content p {
  color: #787878;
  font-family: "Noto Serif KR", serif;
}

.confirmation-card {
  margin-top: 10px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.confirmation-title {
  font-size: 16px;
  font-weight: bold;
  color: #787878;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: #787878;
  margin-bottom: 8px;
}

.input-field {
  margin-bottom: 10px;
}

.v-radio-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: row; /* Ensures radio buttons are inline */
}

.v-radio {
  margin-right: 10px;
}

.v-card-title {
  padding: 0;
  margin: 0;
}
.data-label {
  font-size: 14px;
  font-weight: bold;
  color: #787878;
  display: flex;
  height: 100%; /* Ensures it takes up full column height for alignment */
  padding-top: 20px;
  padding-left: 20px;
}
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f8f8;
}

.container {
  display: flex;
}

.sidebar {
  border-radius: 10px;
  padding-top: 10px;
  width: 250px;
  height: 80vh;
  
  padding: 20px;
  justify-self: center;
}

.sidebar h2 {
  margin-top: 0;
  font-size: 1.5em;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar li h3 {
  margin: 0;
  font-size: 1.2em;
}

.sidebar li ul {
  padding-left: 20px;
  margin: 5px 0 0 0;
}

.sidebar li ul li {
  margin: 5px 0;
  font-size: 1em;
}
.sidebar h3 {
  border-bottom: 1px solid black;
}
.v-btn {
  margin: 0;
  font-family: "Noto Serif KR", serif;
  border: none !important;
  box-shadow: none !important;
  
}

.custom-size {
  width: 200px;
  height: 60px;
  justify-content: left;
}
.sidebar > a {
  text-decoration: none;
  color: black;
}
.user-profile {
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.user-profile h1 {
  border-bottom: 4px solid black;
}
</style>
