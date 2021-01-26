import axios from "axios";


export async function getPets() {
  try {
    const { data } = await axios.get("/api/pets");
    return data;
  } catch (error) {
    throw error;
  }
}
