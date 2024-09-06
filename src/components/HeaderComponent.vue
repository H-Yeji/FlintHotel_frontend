<template>
  <div>
    <v-app-bar app color="transparent" flat class="top-nav" v-show="!isScrolled"
      :style="{ transition: 'transform 0.3s ease-in-out', transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)' }">
      <v-container>
        <v-row>
          <v-btn text style="font-size: 13px; color:#FFFFFF; margin-left:auto; margin-right:-20px;" v-if="!isLogin"
            @click="login()">LOGIN</v-btn>
          <v-btn text style="font-size: 13px; color:#FFFFFF; margin-right:-20px;" v-if="!isLogin"
            @click="$router.push('/member/signup')">JOIN</v-btn>
          <v-btn text style="font-size: 13px; color:#FFFFFF; margin-left:auto; margin-right:-20px;" v-if="isLogin"
            :to="{ path: `/mypage` }">MYPAGE</v-btn>
          <!-- 바로 위, 아래 수정 -->
          <v-btn text style="font-size: 13px; color:#FFFFFF; margin-right:-20px;" v-if="isLogin"
            @click="logout()">LOGOUT</v-btn>
          <v-btn text style="font-size: 13px; color:#FFFFFF; margin-right:-20px;" @click="goInquiry()">INQUIRY {{ count
            }}</v-btn>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-app-bar app color="transparent" flat class="login-nav" v-show="!isScrolled"
      :style="{ transition: 'transform 0.3s ease-in-out', transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)' }">
      <v-container>
        <v-row justify="center" style="padding-right: 30px;">
          <v-btn text style="color:#FFFFFF; font-size: 16px;">INTRODUCE</v-btn>
          <v-btn text style="color:#FFFFFF; font-size: 16px;" @click="openReservationDialog">RESERVATION</v-btn>
          <v-btn text style="font-size: 40px; color:#FFFFFF" @click="$router.push('/')">FLINT HOTEL</v-btn>
          <v-btn text style="color:#FFFFFF; font-size: 16px;">DINING</v-btn>
          <v-btn text style="color:#FFFFFF; font-size: 16px;">ROOM</v-btn>
        </v-row>

        <!-- reservation 클릭 후 > 모달창 -->
        <v-dialog v-model="dialogReservation" max-width="400px">
          <v-card style="border: none;">
            <div style="background-color: #D5DCEA; height: 50px; border-radius: 4px 4px 0 0;"></div>
            <v-card-text class="cardText" style="padding: 24px;">
              <v-row class="button-row" justify="center">
                <v-col cols="6" md="6" class="d-flex justify-center">
                  <v-btn class="custom-btn" size="large" style="color: black; background-color: white; border-color: #D5DCEA; border-width: 3px;
                  padding-top:10px; padding-bottom:30px; width: 100%; max-width: 160px; box-shadow: none; font-size: 15px;"
                    @click="RoomReservationBtn">Room</v-btn>
                </v-col>
                <v-col cols="6" md="6" class="d-flex justify-center">
                  <v-btn class="custom-btn" size="large" style="color: black; background-color: white; border-color: #D5DCEA; border-width: 3px;
                  padding-top:10px; padding-bottom:30px; width: 100%; max-width: 160px; box-shadow: none; font-size: 15px;"
                    @click="DiningReservationBtn">Dining</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- 대기열 위치를 보여주는 다이얼로그 -->
        <v-dialog v-model="showQueuePositionDialog" max-width="400px" class="modal">
          <v-card>
            <v-card-title>서비스 접속 대기 중입니다.</v-card-title>
            <v-card-text>
              <p>현재 대기 순서: {{ currentPosition - 45 }}번째 입니다.</p>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="handleDialogClose" style="color:#787878; font-size: 15px; font-family: 'Noto Serif KR', serif;">닫기</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import { EventSourcePolyfill } from 'event-source-polyfill';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export default {
  data() {
    return {
      isLogin: false,
      isScrolled: false,
      dialogReservation: false,
      count: 0,
      showQueuePositionDialog: false, // 대기열 모달을 위한 변수
      currentPosition: null, // 현재 대기열 위치를 저장하는 변수
      requestId: null,
      eventSource: null, // SSE 연결을 관리하는 변수
    }
  },
  created() {

    const token = localStorage.getItem('membertoken');
    // view 에서 sse 관련한 실시간 연결 통신을 지원하는 객체가 EventSourcePolyfill
    if (token) {
      let sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/inquiry/subscribe`, { headers: { Authorization: `Bearer ${token}` } });
      sse.addEventListener('connect', (event) => {  // connect 라는 event 가 들어오면
        console.log(event);
      });
      // 메시지가 빈 값이 아닐 때만 수신함
      sse.addEventListener('answer', (event) => {
          if (event.data && event.data !== '""') {
              console.log(event);
              this.count += 1;
          }
      });
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.checkLoginStatus() // 여기 추가
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    this.closeSSEConnection() // 컴포넌트가 파괴될 때 SSE 연결 종료
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    checkLoginStatus() {
      const token = localStorage.getItem('membertoken');
      if (token) {
        this.isLogin = true // 토큰이 존재하면 로그인 상태로 설정
      }
    },
    logout() {
      localStorage.removeItem('membertoken') // 토큰 제거
      this.isLogin = false // 로그아웃 상태로 설정
      this.$router.push("/")
    },
    login() {
      this.$router.push("/member/login")
    },
    openReservationDialog() {
      this.dialogReservation = true;
    },
    async RoomReservationBtn() {
      const token = localStorage.getItem('membertoken')

      if (token) {
        try {
          const decodedToken = jwtDecode(token)
          const email = decodedToken.sub
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/submit`, null, { params: { email: email } })

          if (response.data && response.data.status_code === 200) {
            const { requestId, position } = response.data.result

            this.requestId = requestId
            this.currentPosition = position

            // 대기열 위치가 50 미만일 경우 예약 페이지로 이동
            if (this.currentPosition < 50) {
              this.dialogReservation = false  // 예약 모달을 닫고
              this.showQueuePositionDialog = false // 대기열 모달 닫기
              this.closeSSEConnection() // SSE 연결 종료
              this.$router.push(`/reserve/room`)
            } else {
              // 대기열 위치가 50 이상일 경우 대기열 모달을 열고 SSE 연결 시작
              this.dialogReservation = false  // 예약 모달을 닫고
              this.showQueuePositionDialog = true  // 대기열 모달 열기
              this.startQueueCheck()  // 대기열 위치 체크 시작
            }
          } else {
            alert(`요청 처리에 실패했습니다. 메시지: ${response.data.status_message}`)
          }
        } catch (error) {
          console.error('Error while submitting request:', error)
          alert('요청 처리 중 오류가 발생했습니다.')
        }
      } else {
        this.$router.push(`/member/login`)
      }
    },
    DiningReservationBtn() {
      this.$router.push(`/reserve/dining/create`);
      this.dialogReservation = false;
    },
    startQueueCheck() {
      const token = localStorage.getItem('membertoken')

      if (token) {
        const decodedToken = jwtDecode(token)
        const email = decodedToken.sub

        // SSE 연결을 초기화하고 이메일을 쿼리 파라미터로 전달
        this.eventSource = new EventSource(`${process.env.VUE_APP_API_BASE_URL}/subscribe?email=${encodeURIComponent(email)}`)

        this.eventSource.onopen = () => {
          // console.log("SSE 연결이 성공적으로 열렸습니다:", this.eventSource.url)
        }

        this.eventSource.addEventListener('갱신 완료', () => {
          this.currentPosition -= 1
          if (this.currentPosition < 50) {
            this.handleDialogClose()
            this.closeSSEConnection()
            this.$router.push(`/reserve/room`)
          }
        })
        // console.log("SSE EventSource 객체:", this.eventSource)

        //// "현재 위치" 이벤트 리스너 등록
        // this.eventSource.addEventListener('현재 위치', (event) => {
        //     // console.log("SSE 메시지 수신 (현재 위치 이벤트):", event)
        //     const data = event.data

        //     if(this.currentPosition < 50){
        //       this.$router.push(`/reserve/room`)
        //     } 
        //     // 데이터에서 대기 순서를 추출하는 로직
        //     const positionMatch = data.match(/(\d+)/) // "나의 대기 순서: xxx번째"에서 숫자만 추출

        //     if (positionMatch) {
        //         this.currentPosition = parseInt(positionMatch[0])
        //         // console.log("현재 위치 업데이트:", this.currentPosition)

        //         // 대기열 위치가 50 미만일 경우 예약 페이지로 이동
        //         if (this.currentPosition < 50) {
        //             this.handleDialogClose()  
        //             this.closeSSEConnection()
        //             this.$router.push(`/reserve/room`)
        //         } else if(this.currentPosition < 500){
        //             this.eventSource.addEventListener('갱신완료', () =>{
        //                 this.currentPosition -= 1
        //                 if(this.currentPosition < 50){
        //                     this.$router.push(`/reserve/room`)
        //                 }
        //             })
        //         }  
        //     } else {
        //         // console.warn("메시지에서 대기 순서를 추출하지 못했습니다:", data)
        //     }
        // })

        this.eventSource.onerror = (error) => {
          console.error('SSE 연결 오류 발생:', error);
          if (this.eventSource.readyState === EventSource.CLOSED) {
            // console.log('SSE 연결이 종료되었습니다.')
          }
          this.closeSSEConnection()
        }

        // 추가 확인용 로그
        // console.log("SSE 핸들러가 등록되었습니다.")
      } else {
        this.$router.push(`member/login`)
        // console.error('토큰이 없습니다. SSE 연결을 초기화할 수 없습니다.')
      }
    },
    closeSSEConnection() {
      if (this.eventSource) {
        this.eventSource.close()
        // console.log('SSE 연결이 종료되었습니다.')
        this.eventSource = null // 연결 종료 후 변수 초기화
      }
    },
    handleDialogClose() {
      this.closeSSEConnection() // SSE 연결 종료

      if (this.requestId) {
        axios.delete(`${process.env.VUE_APP_API_BASE_URL}/leave/${this.requestId}`)
          .then(response => {
            if (response.status === 204) {
              this.requestId = ""
              console.log('Successfully left the queue.')
              this.showQueuePositionDialog = false
            } else {
              console.error('Unexpected response status:', response.status)
              alert('대기열에서 나가는 중 오류가 발생했습니다.')
            }
          })
          .catch(error => {
            console.error('Error while leaving the queue:', error)
            alert('대기열에서 나가는 중 오류가 발생했습니다.')
          })
      }
    },
    goInquiry() {
      this.count = 0;
      this.$router.push('/mypage/qna/list')
      window.location.reload();
    }
  },
};
</script>

<style scoped>
.login-nav {
  z-index: 10;
  margin-top: -25px;
}

.top-nav {
  z-index: 10;
  margin-top: -10px;
}

.v-btn {
  font-family: 'Playfair Display', serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 1;
  color: #FFFFFF;
}
.modal {
  padding: 20px;
  font-family: "Noto Serif KR", serif;
}
</style>