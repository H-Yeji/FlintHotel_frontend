<template>
  <!-- 네비게이션바 -->
  <v-app-bar app dark dense>
    <v-container>
      <!-- 행의 자식 요소들을 중앙정렬  -->
      <v-row align="center" no-gutters class="flex-nowrap justify-space-between">
      <!-- 좌측 버튼들 -->
      <v-col class="d-flex justify-start" cols="auto">
        <v-btn @click="openDiningReservationModal()" class="mx-2" style="color: black;">Dining({{ newDiningReservationCount }})</v-btn>
        <v-btn @click="openRoomReservationModal()" class="mx-2" style="color: black;">Room({{ newReservationCount }})</v-btn>
        <v-btn @click="openMemberDialog" class="mx-2" style="color: black;">Member</v-btn>
        <v-btn v-if="department === 'Office'" :to="{ path: `/employee/${dept}` }" class="mx-2" style="color: black;">{{ manage }}</v-btn>
        <v-btn v-else @click="openManageDialog" class="mx-2" style="color: black;">{{ manage }}</v-btn>
      </v-col>
      <!-- 우측 버튼들 -->
      <v-col class="d-flex justify-end" cols="auto">
        <v-btn class="flint-hotel-title" :to="{ path: '/employee' }">HOME</v-btn>
        <v-btn v-if="!isLogin" :to="{ path: '/employee/login' }" class="mx-2">Login</v-btn>
        <v-btn v-else-if="isLogin" @click="Logout()" class="mx-2">Logout</v-btn>
      </v-col>
    </v-row>

      <!-- member 클릭 > 모달창 -->
      <v-dialog v-model="dialogMember" max-width="400px">
        <v-card style="border: none;">
          <div style="background-color: #828282; height: 50px; border-radius: 4px 4px 0 0;"></div>
          <v-card-text class="cardText" style="padding: 24px;">
            <v-row class="button-row" justify="center">
              <v-col cols="6" md="6" class="d-flex justify-center">
                <v-btn class="custom-btn" size="large" style="color: black; background-color: #E5E5E5; 
                  padding-top:10px; padding-bottom:30px; width: 100%; max-width: 160px; border: none;"
                  @click="memberListBtn">Member List</v-btn>
              </v-col>
              <v-col cols="6" md="6" class="d-flex justify-center">
                <v-btn class="custom-btn" size="large" style="color: black; background-color: #E5E5E5;
                  padding-top:10px; padding-bottom:30px; width: 100%; max-width: 160px; border: none;"
                  @click="qnaManageBtn">QnA Manage</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>


      <!-- Room Manage 클릭 > 모달창 -->
      <v-dialog v-model="dialogManage" max-width="400px">
        <v-card style="border: none;">
          <div style="background-color: #828282; height: 50px; border-radius: 4px 4px 0 0;"></div>
          <v-card-text class="cardText" style="padding: 24px;">
            <v-row class="button-row" justify="center">
              <v-col cols="12" md="8" class="d-flex justify-center">
                <v-btn class="custom-btn" size="large" v-if="isDining" @click="navigateToMenu" style="color: black; background-color: #E5E5E5; 
                  padding-top:10px; padding-bottom:30px; width: 100%; max-width: 160px; border: none;">Menu
                  Manage</v-btn>
                <v-btn class="custom-btn" size="large" v-if="isRoom" @click="navigateToMenu" style="color: black; background-color: #E5E5E5; 
                  padding-top:10px; padding-bottom:30px; width: 100%; max-width: 160px; border: none;">Room
                  Price</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- 다이닝 예약 알림 모달창 -->
      <v-dialog v-model="diningDialogSSE" max-width="600px">
        <v-card style="font-family: Playfair Display, serif; padding-left:15px;
        padding-top:15px;">
          <v-card-title class="headline">New Reservations</v-card-title>
          <v-card-text>
            <div v-if="newDiningReservationCount === 0" style="font-family: Noto Serif KR, serif;">
              새로운 예약이 없습니다.
            </div>
            <div v-else>
              <ul>
                <li v-for="reservation in diningRecentReservations" :key="reservation.id"
                  style="font-family: Noto Serif KR, serif;" @click="goToDiningReservationDetail(reservation.id)">
                  [{{ reservation.id }}] : Reserve-Date {{ reservation.reserveDate }}&nbsp;{{ reservation.reserveTime }}
                </li>
              </ul>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeDiningReservationModal" style="color: black;">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- 객실 예약 알림 모달창 -->
      <v-dialog v-model="roomDialogSSE" max-width="600px">
        <v-card style="font-family: Playfair Display, serif; padding-left:15px;
            padding-top:15px;">
          <v-card-title class="headline">New Reservations</v-card-title>
          <v-card-text>
            <div v-if="newReservationCount === 0" style="font-family: Noto Serif KR, serif;">
              새로운 예약이 없습니다.
            </div>
            <div v-else>
              <ul>
                <li v-for="reservation in recentReservations" :key="reservation.id"
                  style="font-family: Noto Serif KR, serif;" @click="goToReservationDetail(reservation.id)">
                  [{{ reservation.roomType }}] : Check-in {{ reservation.checkInDate }} ~ Check-out {{
                    reservation.checkOutDate }}
                </li>
              </ul>
            </div>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn @click="goToRoomReservationDetails">Details</v-btn> -->
            <v-btn @click="closeRoomReservationModal" style="color: black;">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app-bar>
</template>
<script>
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      department: "",
      manage: "",
      dialogMember: false,
      dialogManage: false,
      roomDialogSSE: false,
      isLogin: false,
      router: useRouter(),
      employeeDepartment: null,
      recentReservations: [],
      dept: "",
      diningDialogSSE: false,
      diningRecentReservations: []
    }
  },
  mounted() {
    if (localStorage.getItem("employeetoken")) {
      const payload = jwtDecode(localStorage.getItem('employeetoken'));
      this.department = payload.department;
      this.dept = this.department.toLowerCase();
      this.manage = payload.department + " " + "Manage";

      if (this.dept.includes("dining") || this.dept.includes("lounge")) {
        this.dept = "dining/menu"
      }

      const storedReservations = JSON.parse(localStorage.getItem('recentReservations'));
      if (storedReservations) {
        this.recentReservations = storedReservations;
      }

      const storedDiningReservations = JSON.parse(localStorage.getItem('diningRecentReservations'));
      if (storedDiningReservations) {
        this.diningRecentReservations = storedDiningReservations;
      }
      console.log(this.department)
    }
  },
  created() {
    if (localStorage.getItem('employeetoken')) {
      const token = localStorage.getItem("employeetoken");
      if (token) {
        // 토큰이 있으면 정상 
        this.isLogin = true
        const decodedToken = jwtDecode(token)

        this.employeeDepartment = decodedToken.department // department 꺼내담기 
        console.log("부서 : ", this.employeeDepartment);
      }

      let email = '';
      switch (this.employeeDepartment) {
        case 'KorDining':
          email = "flint_kor@gmail.com"
          break;
        case 'ChiDining':
          email = "flint_chi@gmail.com"
          break;
        case 'JapDining':
          email = "flint_jap@gmail.com"
          break;
        case 'Lounge':
          email = 'flint_lou@gmail.com'
          break;
        default:
          console.log("No matched department")
          break;
      }
      if (email) {
        try {
          let sse = new EventSourcePolyfill(
            `${process.env.VUE_APP_API_BASE_URL}/dining/subscribe`,
            { headers: { Authorization: `Bearer ${token}` }}
          );
          sse.addEventListener('connect', (event) => {
            console.log("Connected: ", event);
          });
          sse.addEventListener('reserved', (event) => {
            console.log("Reservation received:", event.data);

            this.incrementDiningReservationCount();
            this.diningRecentReservations.push(JSON.parse(event.data));
            // 데이터가 들어오는 순간 localStorage 에 저장.
            localStorage.setItem('diningRecentReservations', JSON.stringify(this.diningRecentReservations))
          });
          sse.onerror = (error) => {
            if (error.error.message.includes('No activity within')) {
              return;
            }
            console.error(error);
          };
        } catch (error) {
          console.log(error)
        }
      }
      if (this.employeeDepartment === 'Room') {
        let sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/room/subscribe`, { headers: { Authorization: `Bearer ${token}` } });
        sse.addEventListener('connect', (event) => {
          console.log(event);
        })
        // 객실 예약이 들어오는 것 listen 
        sse.addEventListener('booked', (event) => {
          console.log('새로운 객실 예약이 들어왔습니다. :', event.data);
          // this.newReservationCount += 1; 
          this.incrementReservationCount();
          this.recentReservations.push(JSON.parse(event.data));
          // 데이터가 들어오는 순간 localStorage 에 저장.
          localStorage.setItem('recentReservations', JSON.stringify(this.recentReservations))
        });
      }
    }
  },
  computed: {
    ...mapState('reservation', ['newReservationCount']),
    ...mapState('diningReservation', ['newDiningReservationCount']),
    isDining() {
      return ['KorDining', 'JapDining', 'ChiDining', 'Lounge'].includes(this.department);
    },
    isRoom() {
      return this.department === 'Room';
    }
  },
  methods: {
    ...mapActions('reservation', ['incrementReservationCount', 'decrementReservationCount']),
    ...mapActions('diningReservation', ['incrementDiningReservationCount', 'decrementDiningReservationCount']),
    openMemberDialog() {
      this.dialogMember = true;
    },
    memberListBtn() {
      this.$router.push(`/employee/member/list`);
      this.dialogMember = false;
    },
    qnaManageBtn() {
      this.$router.push(`/employee/qna/list`);
      this.dialogMember = false;
    },
    openManageDialog() {
      console.log("hi");
      this.dialogManage = true;
    },
    navigateToMenu() {
      const path = this.isDining ? '/employee/dining/menu' : '/employee/room/modprice';
      this.$router.push(path);
      console.log("hihi");
      this.dialogManage = false;
    },
    openRoomReservationModal() {
      this.roomDialogSSE = true;
    },
    openDiningReservationModal() {
      this.diningDialogSSE = true;
    },
    closeRoomReservationModal() {
      this.roomDialogSSE = false
      this.$router.push(`/employee/room`);
    },
    closeDiningReservationModal() {
      this.diningDialogSSE = false;
      this.$router.push(`/employee/dining`);
    },
    async goToReservationDetail(reservationId) {
      // detail 조회를 위해 선택한 예약만 제거 (조회한 예약id와 같지 "않은" 것만 남겨두기)
      this.recentReservations = this.recentReservations.filter(reservation => reservation.id !== reservationId);

      this.decrementReservationCount();

      if (this.recentReservations.length === 0) {
        localStorage.removeItem('recentReservations');
      } else {
        localStorage.removeItem('recentReservations')
        localStorage.setItem('recentReservations', JSON.stringify(this.recentReservations));
      }
      setTimeout(() => this.goToDetail(reservationId), 300);
      this.dialogSSE = false;
    },
    goToDetail(reservationId) {
      window.location.href = `/employee/room/${reservationId}`;
    },
    goToDiningReservationDetail(reservationId) {
      // detail 조회를 위해 선택한 예약만 제거 (조회한 예약id와 같지 "않은" 것만 남겨두기)
      this.diningRecentReservations = this.diningRecentReservations.filter(reservation => reservation.id !== reservationId);
      // 조회하고 남은 수 계산 
      this.decrementDiningReservationCount();

      if (this.diningRecentReservations.length === 0) {
        localStorage.removeItem('diningRecentReservations');
      } else {
        localStorage.removeItem('diningRecentReservations')
        localStorage.setItem('diningRecentReservations', JSON.stringify(this.diningRecentReservations));
      }
      setTimeout(() => this.goToDiningDetail(reservationId), 300);
      this.diningDialogSSE = false;
    },
    goToDiningDetail(reservationId) {
      window.location.href = `/employee/dining/detail/${reservationId}`;
    },
    Logout() {
      this.isLogin = false;
      localStorage.removeItem('employeetoken');
      window.location.reload();
    }
  }
};
</script>

<style>
.flint-hotel-title {
  font-size: 24px;
  font-family: "Playfair Display", serif;
}

.v-btn {
  margin: 0 10px;
  font-family: "Noto Serif KR", serif;
}
/* 추가된 스타일 */@media (max-width: 768px) {
  .v-btn {
    font-size: 12px; /* 작은 화면에서는 폰트 크기를 줄임 */
    margin: 0 5px; /* 작은 화면에서는 마진을 줄임 */
    padding: 0 8px; /* 작은 화면에서는 패딩을 줄임 */
  }
  .flint-hotel-title {
    font-size: 18px; /* 작은 화면에서는 타이틀의 크기를 줄임 */
  }
  .v-app-bar {
    padding: 0 10px; /* 작은 화면에서는 네비게이션 바의 패딩을 줄임 */
  }
}
</style>