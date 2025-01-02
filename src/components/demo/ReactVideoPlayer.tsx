import React from 'react';
import ReactPlayer from 'react-player';

const ReactVideoPlayer = ({url,controls,width,height}:any) => {
  const config = {
    file: {
      attributes: {
        crossOrigin: 'anonymous',
      },
    },
  };
  return (
    <div>
      <ReactPlayer
        url={url}
        controls={controls}
        playing={false}
        loop={false}
        width={width}
        height={height}
        config={config}
      />
    </div>
  );
};

export default ReactVideoPlayer;