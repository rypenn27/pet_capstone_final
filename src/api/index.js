import axios from "axios";

// export async function getSomething() {
//   try {
//     const { data } = await axios.get('/api');
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

export async function getPets() {
  try {
    const { data } = await axios.get("/api/pets");
    return data;
  } catch (error) {
    throw error;
  }
}
