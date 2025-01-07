const VideoExtension = (file: any) => {
  if (file) {
    const extension = file?.includes(".") ? file.split(".").pop() : file.split("/").pop();
    // console.log(extension, "extensionextensionextension")
    return extension == "mp4" ? "video/mp4" :
      extension == "m3u8" ? "application/x-mpegURL" :
        extension == "mp3" ? "audio/mp3" : ''
  }
};
export default VideoExtension; 