import { connect as connectVideo, Participant } from "twilio-video";

const TwilioVideo = require("twilio-video");

function useTwilioVideoRoom(token) {
  const [room, setRoom] = useState();
  const [participants, setParticipants] = useState();
  let LocalTracks;

  async function join() {
    try {
      const room = await connectVideo(token, { tracks: LocalTracks });
      setRoom(room);
      setParticipants(room.participants);
    } catch (e) {
      console.log(e);
    }
  }

  function connectToLocalTracks(room, ref) {
    room.localParticipant.tracks.forEach((x) => {
      ref(x.track.attach());
    });
  }

  useEffect(() => {
    handleTwilioEvents(room);
    return () => {
      room.disconnect();
    };
  }, [room]);

  function connectParticipantToRef(ref, participant) {
    participant.tracks.forEach((pub) => {
      if (pub.isSubscribed) {
        ref.appendChild(pub.track.attach());
      }
      participant.on("trackSubscribed", (t) => {
        ref.appendChild(t.attach());
      });
    });
    ref.attach();
  }

  async function onVideoOptionChange(videoOptionId) {
    LocalTracks = await TwilioVideo.createLocalTracks({
      audio: true,
      video: { videoOptionId },
    });
  }

  async function onAudioOptionChange(audioOptionId) {
    LocalTracks = await TwilioVideo.createLocalTracks({
      audio: true,
      video: { audioOptionId },
    });
  }

  function handleTwilioEvents(room) {
    room.on("participantConnected", (participant) => {
      setParticipants([...participants, participarticipant]);
    });

    room.on("participantDisconected", (participant) => {
      console.log("Participant Disconnected", participant);
      const leftParticipants = participants.filter(
        (x) => x.id != participant.id
      );
      setParticipants(leftParticipants);
    });
  }
  return {
    participants,
    room,
    connectParticipantToRef,
    onVideoOptionChange,
    onAudioOptionChange,
    connectToLocalTracks
  };
}

// async function ConnectToVideo() {
//   try {
//     room = await TwilioVideo.connect(Token, { tracks: LocalTracks });

//     connectToLocalTracks();

//     room.participants.forEach((participant) => {
//       console.log(participant, "participant");
//       subscribeToParticipantTracks(participant);
//     });
//     room.on("participantConnected", (participant) => {
//       console.log(`${participant} connected to the room`);
//       subscribeToParticipantTracks(participant);
//     });

//     room.on("participantDisconected", (participant) => {
//       console.log("Participant Disconnected", participant);
//     });
//   } catch (e) {
//     console.log("Could not connect to video", e.message);
//   }
// }

// (async function () {
//   await ChooseMediaToShare();
//   window.onload = handleEventListeners;
//   window.onbeforeunload = disconnect;
// })();

// function handleEventListeners() {
//   byId("JoinRoom").addEventListener("click", onTryToJoinRoom);
// }

// async function onTryToJoinRoom() {
//   const roomname = byId("RoomName");
//   const username = byId("UserName");
//   try {
//     await JoinRoom(roomname.value, username.value);
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function ConnectToVideo() {
//   try {
//     room = await TwilioVideo.connect(Token, { tracks: LocalTracks });

//     connectToLocalTracks();

//     room.participants.forEach((participant) => {
//       console.log(participant, "participant");
//       subscribeToParticipantTracks(participant);
//     });
//     room.on("participantConnected", (participant) => {
//       console.log(`${participant} connected to the room`);
//       subscribeToParticipantTracks(participant);
//     });

//     room.on("participantDisconected", (participant) => {
//       console.log("Participant Disconnected", participant);
//     });
//   } catch (e) {
//     console.log("Could not connect to video", e.message);
//   }
// }

// function disconnect() {
//   room.disconnect();
// }
// function connectToLocalTracks() {
//   room.localParticipant.tracks.forEach((x) => {
//     document.body.appendChild(x.track.attach());
//   });
// }

// async function ChooseMediaToShare() {
//   const devices = await navigator.mediaDevices.enumerateDevices();
//   const videoDevices = devices.filter((d) => d.kind === "videoinput");
//   const audioDevices = devices.filter((d) => d.kind === "audioinput");

//   const audioOptions = audioDevices.map((x) =>
//     createOption({ value: x.deviceId, text: x.label })
//   );
//   const videoOptions = videoDevices.map((x) =>
//     createOption({ value: x.deviceId, text: x.label })
//   );

//   byId("VideoInput").innerHTML = videoOptions;
//   byId("VideoInput").onchange = onVideoOptionChange;

//   byId("AudioInput").innerHTML = audioOptions;
//   byId("AudioInput").onchange = onAudioOptionChange;

//   byId("UpdateTracks").onclick = updateTracks;
// }

// async function updateTracks() {
//   await ConnectToVideo(Token, { tracks: LocalTracks });
// }

// function createOption({ value, text }) {
//   return `<option value=${value}>${text}</value>`;
// }
