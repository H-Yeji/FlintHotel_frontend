<template>
    <div>
      <EmployeeView />
      <v-container class="content-container">
        <v-row>
          <v-col cols="12" class="d-flex justify-center">
            <v-card class="confirmation-card" style="width: 1100px; height: auto">
              <v-card-title class="confirmation-title">My Info</v-card-title>
              <br />
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <!-- 고객정보 -->
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Emp No</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field v-model="empNo" readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Name</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field v-model="name" readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Email</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field v-model="email" readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Phone num</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="phoneNumber"
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
  
                  <v-col cols="12" md="6">
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Rank</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field v-model="rank" readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Department</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="department"
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="4">
                        <div class="data-label">Date of Employee</div>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-text-field v-model="empDate" readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Gender</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field v-model="gender" readonly></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="justify-end">
                  <v-btn
                    style="
                      color: white;
                      background-color: #7a6c5b;
                      margin-right: 10px;
                      font-size: 15px;
                    "
                    @click="openModifyDialog"
                  >
                    Modify
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- 수정 모달창 -->
        <v-dialog v-model="dialog" style="width: 600px; font-family: Noto Serif KR, serif;">
          <v-card style="padding: 20px">
            <v-card-text>
              <v-row> Change Password </v-row>
              <v-row>
                <v-col cols="12">
                  <input
                    type="password"
                    v-model="beforePassword"
                    id="beforeInput"
                    placeholder="Current Password"
                    style="
                      width: 100%;
                      padding: 10px;
                      border: 1px solid #69586f;
                      border-radius: 5px;
                    "
                    class="custom-input"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <input
                    v-model="afterPassword"
                    type="password"
                    placeholder="New Password"
                    style="
                      width: 100%;
                      padding: 10px;
                      border: 1px solid #69586f;
                      border-radius: 5px;
                    "
                    class="custom-input"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <input
                    v-model="passwordCheck"
                    type="password"
                    placeholder="Confirm New Password"
                    @input="checkPassword"
                    style="
                      width: 100%;
                      padding: 10px;
                      border: 1px solid #69586f;
                      border-radius: 5px;
                    "
                    class="custom-input"
                  />
                  <p
                    class="messageClass"
                    style="padding-left: 5px; padding-top: 8px; color: #69586f"
                  >
                    {{ message }}
                  </p>
                </v-col>
              </v-row>
              <v-row class="justify-end">
                <v-btn
                  class="leftbtn"
                  style="background-color: #787878; color: white; margin-right:10px;"
                  @click="changePassword"
                  >Change</v-btn
                >
                <v-btn
                  style="background-color: #787878; color: white"
                  @click="closeDialog"
                  >Cancel</v-btn
                >
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </template>
  
  <script>
  import EmployeeView from "@/views/EmployeeView.vue";
  import axios from "axios";
  
  export default {
    components: {
      EmployeeView,
    },
    data() {
      return {
        name: "",
        empNo: "",
        email: "",
        phoneNumber: "",
        rank: "",
        department: "",
        empDate: "",
        gender: "",
        dialog: false,
        message:'',
        beforePassword:'',
        afterPassword:'',
        passwordCheck:'',
      };
    },
    async created() {
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/employee/detail`);
      const employeeDetail = response.data.result;
  
      this.empNo = employeeDetail.employeeNumber;
      this.name = employeeDetail.firstName + " " + employeeDetail.lastName;
      this.email = employeeDetail.email;
      this.phoneNumber = employeeDetail.phoneNumber;
      this.rank = employeeDetail.employeeRank;
      this.department = employeeDetail.department;
      this.empDate = employeeDetail.dateOfEmployment;
      this.gender = employeeDetail.gender;
    },
    methods: {
      openModifyDialog() {
        this.dialog = true;
      },
      closeDialog() {
        this.dialog = false;
      },
      async changePassword() {
        try {
          if (this.afterPassword === this.passwordCheck) {
              const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/employee/modify`,
              {
                  beforePassword: this.beforePassword,
                  afterPassword: this.afterPassword,
              });
              console.log("비밀번호가 성공적으로 업데이트되었습니다:", response.data);
              alert("비밀번호가 성공적으로 업데이트되었습니다.");
              this.dialog = false;
          } else {
              alert("비밀번호가 일치하지 않습니다.");
          }
        } catch (e) {
          console.log(e);
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
    overflow-x: auto;
    flex-direction: column;
    padding-left: 40px;
    padding-right: 40px;
  }
  
  .custom-title {
    padding-left: 9%;
    font-family: "Noto Serif KR", serif;
    color: #787878;
    text-align: left;
    border-bottom: 3px solid;
  }
  
  .confirmation-card {
    padding: 20px;
    border-radius: 8px;
    border: none;
    width: 100%;
    box-sizing: border-box;
    font-family: "Noto Serif KR", serif;
    height: 90%;
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
  .leftbtn {
      margin-right:-10px;
  }
  </style>
  