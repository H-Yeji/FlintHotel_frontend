<template>
  <v-app>
    <v-main>
      <QnaView />
      <v-container class="reserve-container">
        <v-row justify="center">
          <MypageComponent />
          <v-col cols="9" justify="center">
            <v-card-title class="custom-title">
              <v-text style="font-size : 45px;">Dining Reservation</v-text>
              <p>온라인 예약에 한해 조회 가능합니다.</p>
              <v-col>
                <v-card>
                  <v-card-text>
                    <v-data-table :items="diningList" :headers="tableHeaders" class="elevation-1">
                      <template v-slot:item="{ item }">
                        <tr>
                          <td style="text-align: center;">
                            <router-link :to="{ name: 'MypageDiningDetail', params: { id: item.id } }">
                              {{ item.no }}
                            </router-link>
                          </td>
                          <td style="text-align: center;"> Seoul </td>
                          <td style="text-align: center;"> {{ item.diningName }} </td>
                          <td style="text-align: center;"> {{ item.adult + item.child }} </td>
                          <td style="text-align: center;"> 
                            {{ formatDate(item.reservationDateTime) }}<br />
                            {{ formatTime(item.reservationDateTime) }}
                          </td>
                          <td style="text-align: center;">
                            {{
                              reserveState(item.reservationDateTime)
                            }}
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-card-title>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MypageComponent from "@/components/MypageComponent.vue";
import QnaView from "@/views/QnaView.vue";
import axios from "axios";

export default {
  data() {
    return {
      diningList: [],
      tableHeaders: [
          {title:'Reservation No', key:'no', align:'center'},
          {title:'Hotel', key:'', align:'center'},
          {title:'Dining', key:'checkInDate', align:'center'},
          {title:'Guest', key: 'adult'+'child', align: 'center'},
          {title:'Reservation Time', key:'reservationDateTime', align: 'center'},
          {title:'Status', align:'center'}
      ],
    };
  },
  async created() {
    try {
      // history.pushState(null, null, '/mypage/dining');
      const token = localStorage.getItem("membertoken");
      // {headers: {Authorization: 'Bearer 토큰 값'}}}
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/reserve/dining/userList`,
        { headers }
      );
      this.diningList = response.data.result;
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    formatDate(dateString) {
      const dateOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      const datePart = new Date(dateString).toLocaleDateString(
        undefined,
        dateOptions
      );
      return datePart;
    },
    formatTime(dateString) {
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
      };
      const timePart = new Date(dateString).toLocaleTimeString(
        undefined,
        timeOptions
      );
      return timePart;
    },
    reserveState(reserveTime) {
      const today = new Date();
      reserveTime = new Date(reserveTime);
      if (today > reserveTime) {
        return "Y";
      } else {
        return "N";
      }
    },
  },
  components: {
    MypageComponent,
    QnaView,
  },
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
  overflow: hidden;
  /* Prevents overall page scrolling */
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

.custom-title {
  font-family: "Noto Serif KR", serif;
  color: #69586F;
  font-size: 20px;
}

.custom-title h1,
ul li {
  font-family: "Noto Serif KR", serif;
  border-bottom: 1px solid;
  color: #69586F;
}

.reserve-container {
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
  flex-direction: row;
  /* Ensures radio buttons are inline */
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
  height: 100%;
  /* Ensures it takes up full column height for alignment */
  padding-top: 20px;
  padding-left: 20px;
}

body {
  font-family: "Noto Serif KR", serif;
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
  background-color: #ded6f4;
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

.custom-size {
  width: 200px;
  height: 60px;
  justify-content: left;
}

.sidebar>a {
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
