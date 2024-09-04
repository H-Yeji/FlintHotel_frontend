<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title">비밀번호 변경</v-card-title>
                        <br>
                        <v-card-text>
                            <v-row>
                                <v-col cols="3">
                                    현재 비밀번호
                                </v-col>
                                <v-col cols="9">
                                    <input type="password" v-model="beforePassword" id="beforeInput"
                                        placeholder="현재 비밀번호" />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="3"> 새 비밀번호 </v-col>
                                <v-col cols="9">
                                    <input v-model="afterPassword" type="password" placeholder="새 비밀번호"
                                        @input="checkPassword" />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="3"> 새 비밀번호 확인 </v-col>
                                <v-col cols="9">
                                    <input v-model="passwordCheck" type="password" placeholder="새 비밀번호 확인"
                                        @input="checkPassword" />
                                    <p class="messageClass">{{ message }}</p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-row>
                            <v-col class="d-flex justify-center">
                                <v-btn @click="passwordUpdate()"> 확인 </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import EmployeeView from '@/views/EmployeeView.vue';
import axios from 'axios';

export default {
    components: {
        EmployeeView
    },
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
                const response = await axios.put(
                    `${process.env.VUE_APP_API_BASE_URL}/employee/modify`,
                    {
                        beforePassword: this.beforePassword,
                        afterPassword: this.afterPassword,
                    }
                );
                alert("비밀번호가 성공적으로 업데이트되었습니다:", response.data);
            } catch (e) {
                console.log(e);
            }
        },
        checkPassword() {
            if (this.isCorrect) {
                this.message = "비밀번호가 일치합니다.";
            } else {
                this.message = "비밀번호가 일치하지 않습니다.";
            }
        },
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
    overflow: hidden;
}

.custom-title {
    padding-left: 9%;
    font-family: "playfire Display", serif;
    color: #787878;
    text-align: left;
    border-bottom: 3px solid;
}

.confirmation-card {
    margin-top: 15px;
    padding: 20px;
    border-radius: 8px;
    border: none;
    width: 100%;
    box-sizing: border-box;
    font-family: "Playfair Display", serif;
    box-shadow: none;
    height: 90%;
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

.input-field {
    margin-bottom: 10px;
}

.v-radio-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    flex-direction: row;
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