import { io } from 'socket.io-client';

const socket = io('http://sayed3040.sobhoy.com/:3040'); // Adjust the URL based on your backend server

export default socket;
