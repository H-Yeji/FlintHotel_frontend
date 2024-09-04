<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title"> Menu Management </v-card-title>
                        <v-card-text class="cardText">
                            <v-row class="searchrow d-flex justify-space-between">
                                <!-- 메뉴 추가 버튼: 왼쪽 정렬 -->
                                <v-col cols="12" md="3" v-if="canAccess" class="d-flex justify-start" style="margin-top:7px; margin-left:-30px;">
                                    <v-btn @click="openCreateMenuDialog" color="#7A6C5B" style="font-size: 14px;" elevation="0" outlined>Add Menu</v-btn>
                                </v-col>
                                <!-- 검색 관련 요소: 오른쪽 정렬 -->
                                <v-col cols="12" md="9" class="justify-end">
                                    <v-form @submit.prevent="applySearch" class="d-flex justfiy-end formCustom">
                                        <v-col cols="auto" class="modSearch">
                                            <v-select
                                                v-model="searchType"
                                                :items="searchOptions"
                                                item-title="text"
                                                item-value="value"
                                                dense
                                                hide-details
                                                class="search-type"
                                            >
                                            </v-select>
                                        </v-col>
                                        <v-col cols="7" class="modSearch" style="margin-right: -8px;">
                                            <v-text-field
                                                v-model="searchValue"
                                                label="입력하세요."
                                                dense
                                                hide-details
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="auto">
                                            <v-btn type="submit" style="background-color:#DCC8B0; color:white; font-size: 14px;" elevation="0" outlined>Search</v-btn>
                                        </v-col>
                                    </v-form>
                                </v-col>
                            </v-row>
                            <br>
                            <v-row class="justify-center">
                                <v-col cols="12">
                                    <v-data-table
                                        :items="menuList"
                                        :items-per-page="itemsPerPage"
                                        :server-items-length="totalItems"
                                        hide-default-footer
                                    >
                                        <thead>
                                            <tr>
                                                <th style="text-align: center; padding-left:50px;">Id</th>
                                                <th style="text-align: center; padding-left:50px;">Menu Name</th>
                                                <th style="text-align: center; padding-left:50px;">Menu Price</th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="text-center" v-for="p in menuList" :key="p.menuId">
                                                <td class="id-column-value" style="padding-left:50px;">{{ p.menuId }}</td>
                                                <td class="name-column-value" style="padding-left:50px;">{{ p.menuName }}</td>
                                                <td class="price-column-value" style="padding-left:50px;">{{ p.cost }}원</td>
                                                <td class="col-action">
                                                    <v-btn style="background-color:white; color:#7A6C5B; border: 1px solid #7A6C5B; font-size: 14px;" 
                                                    @click="openEditMenuDialog(p)" elevation="0" outlined small>Modify</v-btn>
                                                    <v-btn style="background-color:white; color:#7A6C5B; border: 1px solid #7A6C5B; font-size: 14px;" 
                                                    @click="openDeleteMenuDialog(p.menuId)" elevation="0" outlined small>Delete</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-data-table>
                                    <!-- 페이지 넘김 버튼: 중앙 정렬 -->
                                    <v-row class="justify-center pagination-buttons" style="margin-top: 20px;">
                                        <v-btn
                                            :disabled="currentPage === 1"
                                            @click="previousPage"
                                            color="primary"
                                            style="font-size: 14px;"
                                            outlined
                                        >
                                            이전 페이지
                                        </v-btn>
                                        <v-btn
                                            :disabled="currentPage === totalPages"
                                            @click="nextPage"
                                            color="primary"
                                            style="font-size: 14px;"
                                            outlined
                                        >
                                            다음 페이지
                                        </v-btn>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- 추가 모달 -->
            <AddMenuModal
                v-model="createDialog"
                @input="createDialog = $event"
                :menuData="createMenuData"
                @create-menu="confirmCreateMenu"
            />

            <!-- 수정 모달 -->
            <ModMenuModal
                v-model="editDialog"
                @input="editDialog = $event"
                :menuData="editMenuData"
                @edit-menu="confirmEditMenu"
            />

            <!-- 삭제 확인 모달 -->
            <DeleteModal
                v-model="deleteDialog"
                :menuId="menuIdToDelete"
                @delete-menu="confirmDeleteMenu"
            />
        </v-container>
    </div>
</template>

<script>
import EmployeeView from '@/views/EmployeeView.vue'
import axios from '@/axios'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'vue-router'
import ModMenuModal from '@/views/employee/dining/ModMenuModal.vue'
import DeleteModal from '@/views/employee/dining/DeleteModal.vue'
import AddMenuModal from '@/views/employee/dining/AddMenuModal.vue'

export default {
    components: {
        EmployeeView,
        AddMenuModal,
        ModMenuModal,
        DeleteModal
    },
    data() {
        return {
            diningMapping: {
                'KorDining': 1,
                'ChiDining': 2,
                'JapDining': 3,
                'Lounge': 4
            },
            department: "",
            searchType: "",
            searchValue: "",
            searchOptions: [
                { text: '선택', value: '' },
                { text: '메뉴 코드', value: 'menuId' },
                { text: '메뉴명', value: 'menuName' }
            ],
            menuList: [],
            canAccess: false,
            pageTitle: '메뉴 목록',
            router: useRouter(),

            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 0,

            createDialog: false,
            createMenuData: {},

            editDialog: false,
            editMenuData: {},

            deleteDialog: false,
            menuIdToDelete: null
        }
    },
    mounted() {
        this.initialize()
    },
    methods: {
        async initialize() {
            const token = localStorage.getItem('employeetoken')
            if (token) {
                const decodedToken = jwtDecode(token)
                this.department = decodedToken.department

                this.canAccess = ['KorDining', 'JapDining', 'ChiDining', 'Lounge'].includes(this.department)

                if (this.canAccess) {
                    this.fetchMenus() // 페이지 데이터를 가져옴
                } else {
                    alert("접근 권한이 없습니다.")
                    this.router.push('/employee/')
                }
            } else {
                alert("로그인이 필요합니다.")
                this.router.push('/employee/login')
            }
        },
        async fetchMenus() {
            try {
                const response = await axios.get(`/employee/dining/list`, {
                    params: {
                        department: this.department,
                        searchType: this.searchType,
                        searchValue: this.searchValue,
                        page: this.currentPage - 1, // 서버는 0 기반 페이지 인덱스를 사용
                        size: this.itemsPerPage
                    }
                })
                this.menuList = response.data.result.content
                this.totalItems = response.data.result.totalElements
                this.totalPages = response.data.result.totalPages
            } catch (error) {
                console.error('Error fetching menu list:', error)
            }
        },
        applySearch() {
            this.currentPage = 1
            this.fetchMenus() // 검색 조건이 적용된 상태에서 데이터 가져오기
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--
                this.fetchMenus()
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++
                this.fetchMenus()
            }
        },
        openCreateMenuDialog() {
            this.createMenuData = {
                menuName: '',
                cost: 0,
                diningId: this.diningMapping[this.department] || null
            }
            this.createDialog = true
        },
        closeCreateMenuDialog() {
            this.createDialog = false
        },
        async confirmCreateMenu(menuData) {
            try {
                await axios.post(`/employee/dining/addmenu`, menuData)
                this.initialize()
                this.closeCreateMenuDialog()
            } catch (error) {
                console.error('생성 실패:', error)
            }
        },
        openEditMenuDialog(menu) {
            this.editMenuData = { ...menu }
            this.editDialog = true
        },
        closeEditMenuDialog() {
            this.editDialog = false
        },
        async confirmEditMenu(menuData) {
            try {
                await axios.patch(`/employee/dining/modmenu/${menuData.menuId}`, {
                    cost: parseInt(menuData.cost)
                })
                this.initialize()
                this.closeEditMenuDialog()
            } catch (error) {
                console.error('Error updating menu:', error)
            }
        },
        openDeleteMenuDialog(menuId) {
            this.menuIdToDelete = menuId
            this.deleteDialog = true
        },
        closeDeleteMenuDialog() {
            this.deleteDialog = false
        },
        async confirmDeleteMenu(menuId) {
            try {
                await axios.delete(`/employee/dining/delmenu/${menuId}`)
                this.menuList = this.menuList.filter(p => p.menuId !== menuId)
                this.closeDeleteMenuDialog()
            } catch (error) {
                console.error('Error deleting menu:', error)
            }
        }
    }
}
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
    box-shadow: none;
}

.search-type {
    max-width: 133px;
    font-size: 0.5rem;
    line-height: 1.25rem;
}
.confirmation-title {
    font-size: 20px;
    font-weight: bold;
    color: #787878;
    text-align: left;
    border-bottom: 3px solid #787878;
    font-family: "Noto Serif KR", serif;
}
.cardText {
    margin-top:20px;
}
.formCustom {
    margin-left: 20%;
    margin-bottom: 8px;
}
.modSearch {
    margin-top: -10px;
}
.tableCustom {
    padding-left: 2%;
}
.section-title {
    font-size: 17px;
    font-weight: bold;
    color: #787878;
    padding-left: 17px;
    padding-bottom: 20px;
    font-family: "Noto Serif KR", serif;
}

.tf {
    margin-right: -20px;
    padding-top: 20px;
}

.search {
    padding-top: 40px;
}

.searchrow {
    margin-right: -20px;
    margin-bottom: -40px;
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
    justify-content: space-between;
    gap: -10px;
    border-bottom: 1px solid #e0e0e0;
    height: 100%;
    padding-top: 40px;
}

.emailcol {
    margin-right: -20px;
}
</style>
