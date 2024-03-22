import {io} from 'socket.io-client';

const url = `http://${window.location.hostname}:3000`;

export default io(url,{
    autoConnect:false
});;