<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title">Dining</v-card-title>
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
                                            <v-text-field v-model="firstName"
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Last name</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="lastName" 
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Email</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="email" 
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Phone num</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="phoneNumber"
                                                readonly></v-text-field>
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
                                            <v-text-field  readonly :value="`${adult}명`"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="5">
                                            <div class="data-label">Child</div>
                                        </v-col>
                                        <v-col cols="12" md="7">
                                            <v-text-field readonly :value="`${child}명`"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="5">
                                            <div class="data-label">Date Time </div>
                                        </v-col>
                                        <v-col cols="12" md="7">
                                            <v-text-field  v-model="reservationDateTime"  readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row style="margin-top:-10px;">
                                        <v-col cols="12" md="4">
                                            <div class="data-label">Comment</div>
                                        </v-col>
                                        <v-col cols="12" md="8">
                                            <v-text-field v-model="comment" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                          <!-- 버튼 추가 -->
                        <v-row class="justify-end">
                            <v-btn class="leftbtn" style="color: white; background-color: #7A6C5B; margin-top: 20px; font-size: 14px;" @click="DiningModify($route.params.diningReservationId)">Modify</v-btn>
                            <v-btn style="color: white; background-color: #CFB18E; margin-top:20px; font-size: 14px;" @click="openDeleteDialog">Cancel</v-btn>
                        </v-row>            
                    </v-card>
                </v-col>
            </v-row>

            <!-- 모달 -->
            <v-dialog v-model="dialog" max-width="400px">
                <v-card class="modal">
                    <v-card-title>정말 삭제하시겠습니까?</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="leftbtn" color="black" @click="DiningCancel">Yes</v-btn>
                        <v-btn color="black" @click="cancelDelete">No</v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
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
            memberId : "",
            comment:"",
            reservationDateTime: "", // 수정된 부분
            dialog:false
        };
    },
    created() {
        this.fetchDiningDetails();
    },
    methods: {
        async DiningModify(id){
            this.$router.push({
                path: `/employee/dining/update/${id}`
            });
        },
        async fetchDiningDetails() {
            try {
              
                this.diningReservationId = this.$route.params.diningReservationId;
                
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/employee/dining/detail/${this.diningReservationId}`);
                
                console.log(response.data.result);
                const diningReseve = response.data.result;

                // 날짜와 시간을 분리하여 저장
                const [date, time] = diningReseve.reservationDateTime.split('T');
                this.reservationDateTime = `${date} ${time}`;  // 수정된 부분
                
                this.firstName = diningReseve.firstname
                this.lastName = diningReseve.lastname
                this.email = diningReseve.email
                this.phoneNumber = diningReseve.phoneNumber;
                this.adult = diningReseve.adult;
                this.child = diningReseve.child;
                this.comment = diningReseve.comment
               
            } catch (error) {
                console.error('Error fetching dining details:', error.response ? error.response.data : error.message);
            }
        },
        openDeleteDialog() {
            this.dialog = true;
        },
        async DiningCancel(){
            try {
                const id = this.$route.params.diningReservationId;
                await axios.get(`/employee/dining/cancel_reserve_dining/${id}`);

                this.$router.push(`/employee/dining`);
            } catch(e) {
                console.log(e);
            } finally {
                this.dialog = false; // 모달 닫기 
            }

        },
        cancelDelete() {
            this.dialog = false;
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
.leftbtn {
    margin-right: 2px;
}

.modal {
    padding: 20px;
    font-family: "Noto Serif KR", serif;
}
</style>