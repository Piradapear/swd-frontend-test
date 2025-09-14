import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// กำหนดหน้าตา (Interface) ของข้อมูล User
export interface User {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  idCardNumber?: string;
  gender: string;
  phoneNumber: string;
  passportNumber?: string;
  expectedSalary: number;
}

// สร้าง Interface สำหรับ State ของ Slice นี้
export interface UserState {
  list: User[];
}

// กำหนด State เริ่มต้น
const initialState: UserState = {
  list: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Action สำหรับตั้งค่า users ทั้งหมด (ใช้ตอนโหลดจาก Local Storage)
    setUsers: (state, action: PayloadAction<User[]>) => {
        state.list = action.payload;
    },
    // Action สำหรับเพิ่ม User
    addUser: (state, action: PayloadAction<Omit<User, 'id'>>) => {
      const newUser = { id: uuidv4(), ...action.payload };
      state.list.push(newUser);
    },
    // Action สำหรับแก้ไข User
    editUser: (state, action: PayloadAction<User>) => {
      const index = state.list.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    // Action สำหรับลบ User คนเดียว
    deleteUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(user => user.id !== action.payload);
    },
    // Action สำหรับลบ user หลายคนพร้อมกัน
    deleteMultipleUsers: (state, action: PayloadAction<string[]>) => {
      // payload คือ Array ของ id ที่จะลบ
      state.list = state.list.filter(user => !action.payload.includes(user.id));
    }
  },
});

// ส่งออก actions และ reducer เพื่อให้ส่วนอื่นของแอปเรียกใช้ได้
export const { setUsers, addUser, editUser, deleteUser, deleteMultipleUsers } = userSlice.actions;
export default userSlice.reducer;

