<template>
    <div>
    <v-app-bar
        app
        color="transparent"
        flat
        class="top-nav"
        v-show="!isScrolled"
        :style="{ transition: 'transform 0.3s ease-in-out', transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)' }"
      >
      <v-container>
        <v-row>
          <v-btn text style="font-size: 13px; color:#4F4337; margin-left:auto; margin-right:-20px;" v-if="!isLogin" @click="login()">LOGIN</v-btn>
          <v-btn text style="font-size: 13px; color:#4F4337; margin-right:-20px;" v-if="!isLogin" @click="$router.push('/member/signup')">JOIN</v-btn>
          <v-btn text style="font-size: 13px; color:#4F4337; margin-left:auto; margin-right:-20px;" v-if="isLogin" :to="{path:`/mypage`}">MYPAGE</v-btn>
          <!-- 바로 위, 아래 수정 -->
          <v-btn text style="font-size: 13px; color:#4F4337; margin-right:-20px;" v-if="isLogin" @click="logout()">LOGOUT</v-btn>
          <v-btn text style="font-size: 13px; color:#4F4337; margin-right:-20px;" @click="$router.push('/mypage/qna/list')">INQUIRY</v-btn>
        </v-row>
      </v-container>
    </v-app-bar>
  
    <v-app-bar
        app
        color="transparent"
        flat
        class="login-nav"
        v-show="!isScrolled"
        :style="{ transition: 'transform 0.3s ease-in-out', transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)' }"
      >
      <v-container>
        <v-row justify="center" style="padding-right: 30px;">
          <v-btn text style="color:#4F4337; font-size: 16px;">INTRODUCE</v-btn>
          <v-btn text style="color:#4F4337; font-size: 16px;" @click="openReservationDialog">RESERVATION</v-btn>
          <v-btn text style="font-size: 40px; color:#4F4337;" @click="$router.push('/')">FLINT HOTEL</v-btn>
          <v-btn text style="color:#4F4337; font-size: 16px;" :to="{path:'/reserve/dining/create'}">DINING</v-btn>
          <v-btn text style="color:#4F4337; font-size: 16px;">ROOM</v-btn>
        </v-row>

        <!-- reservation 클릭 후 > 모달창 -->
      <v-dialog v-model="dialogReservation" max-width="400px">
        <v-card style="border: none;">
          <div style="background-color: #D5DCEA; height: 50px; border-radius: 4px 4px 0 0;"></div>
          <v-card-text class="cardText" style="padding: 24px;">
            <v-row class="button-row" justify="center">
              <v-col cols="6" md="6" class="d-flex justify-center">
                <v-btn class="custom-btn" size="large" style="color: black; background-color: white; border-color: #D5DCEA; border-width: 3px;
                padding-top:10px; padding-bottom:30px; width: 100%; max-width: 160px; box-shadow: none; font-size: 15px;" @click="RoomReservationBtn">Room</v-btn>
              </v-col>
              <v-col cols="6" md="6" class="d-flex justify-center">
                <v-btn class="custom-btn" size="large" style="color: black; background-color: white; border-color: #D5DCEA; border-width: 3px;
                padding-top:10px; padding-bottom:30px; width: 100%; max-width: 160px; box-shadow: none; font-size: 15px;" @click="DiningReservationBtn">Dining</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
       </v-dialog>
      </v-container>

    </v-app-bar>
  </div>
  </template>
  
  <script>
  export default {
      data(){
          return{
              isLogin : false,
              isScrolled: false, 
              dialogReservation: false,
          }
      },
      mounted() {
          window.addEventListener("scroll", this.handleScroll);
          this.checkLoginStatus() // 여기 추가
      },
      beforeUnmount() {
          window.removeEventListener("scroll", this.handleScroll);
      },
      methods: {
      handleScroll() {
        this.isScrolled = window.scrollY > 50;
      },
      checkLoginStatus() {
        const token = localStorage.getItem('membertoken');
        if(token){
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
      RoomReservationBtn() {
        this.$router.push(`/reserve/room`);
        this.dialogReservation = false;
      },
      DiningReservationBtn() {
        this.$router.push(`/reserve/dining/create`);
        this.dialogReservation = false;
      }
    }
  };
  </script>
  
  <style scoped>  
    .login-nav {
    z-index: 10;
    margin-top:-25px;
    }
    .top-nav {
    z-index: 10;
    margin-top:-10px;
    }
    .v-btn {
      font-family: 'Playfair Display', Serif;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 1;
      color: #FFFFFF;
    }
  
  </style>