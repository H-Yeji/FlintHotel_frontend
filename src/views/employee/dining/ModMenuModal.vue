<template>
    <v-dialog v-model="dialog" max-width="400px">
        <v-card class="mainCustom">
            <v-card-title style="text-align:center">Modify Menu</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="confirmEditMenu">
                    <v-text-field v-model="localMenuData.originalCost" label="Before Price" readonly></v-text-field>
                    <v-text-field v-model="localMenuData.cost" label="After Price" type="number" :min="0"></v-text-field>
                    <v-row style="margin-left:23%; margin-top:8px; margin-bottom:8px;">
                        <v-btn class="submitButton" type="submit" style="width:90px; background-color: #7A6C5B; margin-right:3px;">Submit</v-btn>
                        <v-btn class="cancelButton" @click="closeDialog" style="width:90px; background-color: #7A6C5B; margin-left: 3px;">Cancel</v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean, // v-model을 위한 바인딩
        menuData: Object // 수정할 메뉴 데이터
    },
    data() {
        return {
            localMenuData: { 
                ...this.menuData,
                menuId: this.menuData.menuId,
                originalCost: this.menuData.cost, // menuData의 cost를 originalCost로 저장
                cost: this.menuData.cost  // 수정할 가격을 저장
            } 
        }
    },
    watch: {
        menuData: {
            immediate: true,
            handler(newData) {
                // menuData 변경 시 로컬 데이터 업데이트
                this.localMenuData.menuId = this.menuData.menuId
                this.localMenuData.originalCost = newData.cost;
                this.localMenuData.cost = newData.cost;
            }
        }
    },
    computed: {
        dialog: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        closeDialog() {
            this.$emit('input', false)
        },
        async confirmEditMenu() {
            console.log(this.menuData);
            try {
                await this.$emit('edit-menu', this.localMenuData)
                this.closeDialog()
            } catch (error) {
                console.error('Error updating menu:', error)
            }
        }
    }
}
</script>

<style scoped>
.mainCustom {
    font-family: "Noto Serif KR", serif;
    border-radius: 10px;
}
.submitButton{
    background-color: grey;
    color: white;
}

.cancelButton{
    background-color: grey;
    color: white
}
</style>
