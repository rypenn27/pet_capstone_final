import axios from "axios";


export async function getPets() {
  try {
    const { data } = await axios.get("/api/pets");
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getLogInfo() {
  try {
    const { data } = await axios.get("/api/logInfo");
    return data;
  } catch (error) {
    throw error;
  }
}