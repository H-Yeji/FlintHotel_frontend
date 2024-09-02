<template>
  <div>
    <EmployeeView />
    <v-container class="content-container">
      <!-- 회원가입 폼 -->
      <v-main class="main-background">
        <v-container class="join-now-container">
          <v-row>
            <v-col cols="12">
              <h1 class="join-now-title" style="font-family: 'Playfair Display', serif; color:#787878;">Register Employee</h1>
              <p class="welcome-text" style="color:#787878;">직원 생성 페이지입니다.</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-form @submit.prevent="employeeCreate">
                <v-text-field 
                  label="EMAIL *" 
                  v-model="email"
                  required
                ></v-text-field>
                <v-text-field 
                  label="PASSWORD *" 
                  v-model="password"
                  type="password"
                  readonly
                  required
                ></v-text-field>
                <v-text-field 
                  label="FIRST NAME *" 
                  v-model="firstName"
                  required
                ></v-text-field>
                <v-text-field 
                  label="LAST NAME *" 
                  v-model="lastName"
                  required
                ></v-text-field>
              </v-form>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field 
                label="BIRTHDAY" 
                v-model="birthday"
                placeholder="YYYY-MM-DD"
                required
              ></v-text-field>
              <v-text-field 
                label="PHONE NUMBER *" 
                v-model="phoneNumber"
                required
              ></v-text-field>
              <v-text-field 
                label="DATE OF EMPLOYMENT *" 
                v-model="dateOfEmployment"
                required
              ></v-text-field>
              <v-select 
                label="GENDER *" 
                v-model="gender"
                :items="genders"
                required
              ></v-select>
              <v-select 
                label="DEPARTMENT *" 
                v-model="department"
                :items="departments"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn @click="employeeCreate" class="createBtn" style="background-color: #7A6C5B; color:white;">Add Employee</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-container>
    </div>
  </template>
  
  <script>
  import EmployeeView from '@/views/EmployeeView.vue'
  import axios from '@/axios'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  export default{
    components: {
        EmployeeView
    },
      setup(){
          const router = useRouter()

          const email = ref('')
          const password = ref('12341234')
          const firstName = ref('')
          const lastName = ref('')
          const birthday = ref('')
          const phoneNumber = ref('')
          const dateOfEmployment = ref('')
          const gender = ref('')
          const department = ref('')
  
          // 선택 가능한 성별 및 부서 리스트
          const genders = ref(['MALE', 'FEMALE'])
          const departments = ref(['Office', 'Room', 'KorDining', 'JapDining', 'ChiDining', 'Lounge'])
          
          const employeeCreate = async () =>{
              if (!email.value || !password.value || !firstName.value || !lastName.value || !birthday.value || 
              !phoneNumber.value || !dateOfEmployment.value || !gender.value || !department.value) {
                  alert("입력하지 않은 사항이 있습니다.")
                  return
              }
              try{
                  const createData = {
                      email: email.value,
                      password: password.value,
                      firstName: firstName.value,
                      lastName: lastName.value,
                      birthday: birthday.value,
                      phoneNumber: phoneNumber.value,
                      dateOfEmployment: dateOfEmployment.value,
                      gender: gender.value,
                      department: department.value,
                      employeeRank : '사원'
                  }
                  const token = localStorage.getItem('employeetoken') 
                  const response = await axios.post('/employee/create', createData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(response.data)
                alert(response.data.status_message)
                router.push("/employee/office")
              } catch(e){
                    console.log(e.error_message)
              }
          }
          return{
              email,
              password,
              firstName,
              lastName,
              birthday,
              phoneNumber,
              dateOfEmployment,
              gender,
              department,
              genders, 
              departments, 
              employeeCreate,
          }  
      },
  }
  </script>

  <style>
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
    font-family: "Noto Serif KR", serif;
}
.createBtn {
  font-family: "Noto Serif KR", serif;
  color: white;
  margin-left: 85%;
}
</style>
  