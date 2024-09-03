import RoomReservationComponent from "@/components/reserve/room/RoomReservationComponent.vue";
import RoomReservationSuccessComponent from "@/components/reserve/room/RoomReservationSuccessComponent.vue";
import RoomReservationDetailComponent from "@/components/reserve/room/RoomReservationDetailComponent.vue";

export const roomReservationRouter = [
    {
        path: '/reserve/room', // 날짜 및 원하는 객실 선택 
        name: 'RoomReservationComponent',
        component: RoomReservationComponent,
        meta : {header: 'HeaderComponent'}
    },
    {
        path: '/reserve/room/description', // 선택한 객실 상세내용 확인 
        name: 'RoomReservationDetailComponent',
        component: RoomReservationDetailComponent,
        meta : {header: 'HeaderComponent'}
    },
    {
        path: '/reserve/room/success/:id', // 객실 예약 완료 페이지 
        name: 'RoomReservationSuccessComponent',
        component: RoomReservationSuccessComponent,
        meta : {header: 'HeaderComponent'}
    }
]
