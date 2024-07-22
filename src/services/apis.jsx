import instance from './axiosConfig'

const apiProducts = import.meta.env.VITE_API_PRODUCTS


//Get all products
export const getAllProducts = () => {
   const url = `${apiProducts}/allProducts`
   return instance.get(url).then((response) => {
         console.log(response)
          return response
      }).catch((error)=>{
          return error
      })
}

//Manipulate product with batch 
export const batchManipulateProduct = (data) => {
   const url = `${apiProducts}/batch`
   return instance.post(url, data).then((response) => {
      console.log(response)
      return response
   }).catch((error) => {
      return error
   })
}