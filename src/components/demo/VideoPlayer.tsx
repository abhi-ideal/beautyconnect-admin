import React, { useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const activePlayers = new Set();

export const VideoPlayer = (props: any) => {
  const videoRef: any = React.useRef(null);
  const playerRef: any = React.useRef(null);
  const { options, onReady } = props;
  const { videoMuted, setVideoMuted,}:any =useState(true);

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      // Add the new player to the list of active players
      activePlayers.add(player);
      // Pause other videos when this one plays
      player.on("play", () => {
        activePlayers.forEach((p:any) => {
          if (p !== player) {
            p.pause();
          }
        });
      });
    }
  }, [onReady, options, videoRef]);

  //this function is use to store Video.js player mute or unmute
  React.useEffect(()=>{
    const player = playerRef.current;
    player.on('volumechange', () => {
      setVideoMuted(player.muted());
    });
    player?.muted(videoMuted);
  },[ videoMuted ]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        // Remove player from active players set
        activePlayers.delete(player);
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className="h-100 h-100s" data-vjs-player>
      <div className="h-100 h-100s" ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;