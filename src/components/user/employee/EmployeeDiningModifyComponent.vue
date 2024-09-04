<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title">Modify Dining</v-card-title>
                        <br>
                        <v-card-text style="margin-top:-15px;">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <h3 class="section-title">○ 고객 정보</h3>
                                    <!-- 고객정보 -->
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <div class="data-label">First name</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="firstName" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Last name</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="lastName" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Email</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="email" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Phone num</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="phoneNumber" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <h3 class="section-title">○ 예약 정보</h3>
                                    <v-row>
                                        <v-col cols="12" md="5">
                                            <div class="data-label">Adult</div>
                                        </v-col>
                                        <v-col cols="12" md="7">
                                            <v-text-field v-model="adult"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="5">
                                            <div class="data-label">Child</div>
                                        </v-col>
                                        <v-col cols="12" md="7">
                                            <v-text-field v-model="child"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="5">
                                            <div class="data-label">Date Time</div>
                                        </v-col>
                                        <v-col cols="12" md="7">
                                            <v-text-field v-model="reservationDateTime" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="4">
                                            <div class="data-label">Comment</div>
                                        </v-col>
                                        <v-col cols="12" md="8">
                                            <v-text-field v-model="comment"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <!-- 버튼 추가 -->
                        <v-card-actions class="justify-end">
                            <v-btn style="color: white; background-color: #7A6C5B; margin-top: 20px; margin-right: 10px; font-size: 14px;" @click="modify">Modify Completed</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import EmployeeView from '@/views/EmployeeView.vue';
import axios from '@/axios';

export default {
    components: {
        EmployeeView
    },
    data() {
        return {
            diningReservationId: null,
            adult: "",
            child: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            comment: "",
            reservationDateTime: ""  // reservationDateTime을 여기서 관리합니다.
        };
    },
    created() {
        this.fetchDiningDetails();
    },
    methods: {
        async fetchDiningDetails() {
            try {
                // 라우트 파라미터에서 diningReservationId 가져오기
                this.diningReservationId = this.$route.params.diningReservationId;

                // API 요청
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/employee/dining/detail/${this.diningReservationId}`);
                
                const diningReserve = response.data.result;

                // 날짜와 시간을 분리하여 저장
                const [date, time] = diningReserve.reservationDateTime.split('T');
                this.reservationDateTime = `${date} ${time}`;  // 날짜와 시간을 결합하여 표시

                // 기타 정보 설정
                this.firstName = diningReserve.firstname;
                this.lastName = diningReserve.lastname;
                this.email = diningReserve.email;
                this.phoneNumber = diningReserve.phoneNumber;
                this.adult = diningReserve.adult;
                this.child = diningReserve.child;
                this.comment = diningReserve.comment;
               
            } catch (error) {
                console.error('Error fetching dining details:', error.response ? error.response.data : error.message);
            }
        },
        async modify() {
            try {
                const id = this.$route.params.diningReservationId;

                // 현재 reservationDateTime을 `YYYY-MM-DDTHH:MM:SS` 형식으로 변환
                const [date, time] = this.reservationDateTime.split(' ');
                const formattedDateTime = `${date}T${time}`;  // "00"은 초를 추가

                const params = {
                    adult: this.adult,
                    child: this.child,
                    comment: this.comment,
                    reservationDateTime: formattedDateTime
                };

                console.log("params:", params);

                // API 요청
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/employee/dining/update/${id}`, params);
                console.log("response:", response.data.result);

                // 수정 성공 시 detail 페이지로 이동
                this.$router.push(`/employee/dining/detail/${id}`);
            } catch (e) {
                console.log("Error:", e.response ? e.response.data : e.message);
            }
        }
    }
};
</script>

<style scoped>
.content-container {
    background-color: white;
    position: absolute;
    width: 90%;
    max-width: 1200px;
    height: 80%;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow-y: auto;
    flex-direction: column;
    padding-left: 40px;
    padding-right: 40px;
}

.confirmation-card {
    padding: 20px;
    border-radius: 8px;
    border: none;
    width: 100%;
    box-sizing: border-box;
    font-family: "Noto Serif KR", serif;
    height: auto;
    border: none;
    box-shadow: none;
}

.confirmation-title {
    font-size: 20px;
    font-weight: bold;
    color: #787878;
    text-align: left;
    border-bottom: 3px solid #787878;
    font-family: "Noto Serif KR", serif;
}

.section-title {
    font-size: 17px;
    font-weight: bold;
    color: #787878;
    padding-left: 17px;
    padding-bottom: 20px;
    font-family: "Noto Serif KR", serif;
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
    padding-top: 20px;
    padding-left: 20px;
}

</style>
