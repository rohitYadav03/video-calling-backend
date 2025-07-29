import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// below map stores for a room what all peers have joined<
const rooms: Record<string, string[]> = {};
//     In TypeScript, Record<K, V> means: “an object whose keys are of type K,
// and whose values are of type V.”
// Here, K is string (our room IDs), and V is string[] (arrays of peer IDs).

const roomHandler = (socket: Socket) => {

    const createRoom = () => {
const roomId = uuidv4();
socket.join(roomId);
rooms[roomId] = [];
/*
{
roomId1 : [s1, s2,s3],
roomId2 : [s4, s5,s6]
}
Socket.IO internally creates (or updates) its own internal data structure, where it:
Groups sockets (users’ connections) by room ID
Each room holds a list of sockets
That way, you can later emit events like:
*/
socket.emit("room-created", roomId);
console.log(`room created with id : ${roomId}`);
};

// this function is executedd everytime a user  creator or joine joins the new room ?? why
    const joinedRoom = ({roomId, peerId}: {roomId: string, peerId: string}) => {
        console.log(`peerId in backend is : ${peerId} and roomId is ${roomId}`);

        if (!roomId || !peerId) {
    console.warn(" Invalid roomId or peerId:", { roomId, peerId });
    return;
  }

        if (rooms[roomId]) {
            console.log("inside the if of the joined room ");

            console.log(`room Id in roomHandler joined room : ${roomId}`);
            console.log(`new user  peerId: , ${peerId}, room joined : ${roomId}`);

            rooms[roomId].push(peerId);
            console.log(`added peer to room:`, rooms[roomId]);
            console.log(`all rooms:`, rooms);

            socket.join(roomId);

            socket.on("ready", () => {
    // from the frontednd when someone join the room we will emit a ready event
    socket.to(roomId).emit("user-joined", {peerId});
    // Which will automatically go to all sockets in that room.
});

// below event is for loging perpose
            socket.emit("get-users", {
    roomId,
    participants : rooms[roomId],
});

    }

};

    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;
