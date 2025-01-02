import routes from './routes';
import { getAccessToken } from './authToken';


export default function Content() {
  const build=`${process.env.NEXT_PUBLIC_BUILD}`

    // function is for upload content.
    const updateContent = async (contentData: any, type: string) => {
      const result = await getPresignedPostData(type);
      const uploadContent = uploadFileToS3({file:contentData, url:result?.url});
    };
    
    const getContentFiles = async (id:string) => {
      try {
        const url1:any = routes.GET_CONTENT(id);        
        const response1 = await (await fetch(url1, { cache: "no-store" })).json();
        return  {response1};
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }


// function is for call api of  invalidate cache clear.   
    const invalidate = async (id:string,lang:string) => {
      try {
          const url = routes.INVALIDATE_CACHE();
          const data = {
            path :  `/content_pages/${build}/${id}/`
          }
          const accessToken = await getAccessToken();
          const options = {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  Authorization: 'Bearer ' + accessToken
              },
              body: JSON.stringify(data)
          };
          const response = await fetch(url, options);            
          const responseData = await response.json();
          if (!response.ok) {
           
          }
          return responseData;
      } catch (error) {
          console.error('Error:', error);
          throw error;
      }
  };


  const getPresignedPostData = async (id:any) => {
    try {
      const body = {
        fileName: `content/${id}.html`,
        fileType: 'application/json'
      };
      const url = routes.IMAGE_URL();
      const accessFileToken = await getAccessToken();   
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessFileToken
        },
        body: JSON.stringify(body)
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to get presigned post data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const uploadFileToS3 = async (data: any) => {
    try {
      const response = await fetch( data?.url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data?.file)
      });
      if (!response.ok) {
        throw new Error("File upload failed");
      }
      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

    return { updateContent , getContentFiles, invalidate }
}