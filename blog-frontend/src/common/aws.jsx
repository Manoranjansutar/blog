import axios from "axios";

export const uploadImage =  (img) =>{
   const VITE_SERVER_DOMAIN = "http://localhost:3000";
   let imgUrl = null;

return new Promise((resolve, reject) => {
    axios.get(VITE_SERVER_DOMAIN + "/get-upload-url")
      .then(async ({ data: { uploadURL } }) => {
        try {
          await axios({
            method: "PUT",
            url: uploadURL,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: img
          });
          const imgUrl = uploadURL.split("?")[0];
          resolve(imgUrl);
        } catch (error) {
          reject(error);
        }
      })
      .catch(error => reject(error));
  });

}
