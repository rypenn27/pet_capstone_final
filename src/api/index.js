import axios from 'axios';

const axiosWithAuth = () => {
  const token = `Bearer ${localStorage.getItem('token')}`;
  return axios.create({ headers: { Authorization: token } });
};

export async function getPets() {
  try {
    const { data } = await axios.get('/api/pets');
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getLogInfo() {
  try {
    const { data } = await axios.get('/api/login');
    return data;
  } catch (error) {
    throw error;
  }
}

// get users by id
export async function getUserById(userId) {
  try {
    const { data } = await axios.get(`/api/users/${userId}`);
    return data;
  } catch (error) {
    throw error;
  }
}

// get pet by id > pets/petId route
export async function getPetById(petId) {
  try {
    const { data } = await axios.get(`/api/pets/${petId}`);
    return data;
  } catch (error) {
    throw error;
  }
}

// get cart for user
export async function getCart() {
  try {
    const { data } = await axiosWithAuth().get(`/api/cart`);
    return data;
  } catch (error) {
    throw error;
  }
}

// adds pet to cart
export async function addToCart(loginId, petId) {
  const dataToSend = {
    loginId,
    petId,
  };
  console.log('data send', dataToSend);
  try {
    if (dataToSend.loginId && dataToSend.petId.length > 0) {
      /* console.log(dataToSend.userId, dataToSend.productId.length); */
      const { data } = await axiosWithAuth().patch(`/api/cart`, dataToSend);
      return data;
    }
  } catch (error) {
    throw error;
  }
}

// creates user - register route/endpoint
// user object fields required
export async function createUser(username, email, password) {
  const dataToSend = { username, email, password };
  try {
    if (
      dataToSend.username.length > 0 &&
      dataToSend.email.length > 0 &&
      dataToSend.password.length > 0
    ) {
      const { data } = await axios.post(`/api/register`, dataToSend);
      console.log(data);
      return data;
    }
  } catch (error) {
    console.dir(error);
    throw error;
  }
}

// user login
export async function loginUser(username, password) {
  const dataToSend = { username, password };
  try {
    if (dataToSend.username.length > 0 && dataToSend.password.length > 0) {
      const { data } = await axios.post(`/api/login`, dataToSend);
      return data;
    }
  } catch (error) {
    throw error;
  }
}

// Send the google data token to backend
export async function sendGoogleData(googleData) {
  console.log('gooogle data', googleData);
  const token = googleData.tokenId;
  const dataToSend = { token };
  console.log('data send', dataToSend);
  try {
    if (dataToSend.token.length > 0) {
      const { data } = await axios.post(`/api/google-login`, dataToSend);
      console.log('login success');
      return data;
    }
  } catch (error) {
    throw error;
  }
}

// google Login
export async function loginGoogle() {
  // const dataForGoogle = {}
  console.log('in loginGoogle()');
  try {
    const { data } = await axios.get('api/googlelogin' /*, dataForGoogle*/);
    console.log('in loginGoogle() api/index', data);
    return data;
  } catch (error) {
    throw error;
  }
}

// update user
// user object fields are required
export async function updateUser(username, email, password, loginId) {
  const dataToSend = { username, email, password, loginId };
  try {
    // if (
    //   dataToSend.username.length > 0 &&
    //   dataToSend.email.length > 0 &&
    //   dataToSend.password.length > 0
    // )
    // {}

    const { data } = await axiosWithAuth().patch(
      `/api/login/${loginId}/update`,
      dataToSend
    );
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getRescueOrder() {
  try {
    const { data } = await axiosWithAuth().get('/api/RescueOrders');
    return data;
  } catch (error) {
    throw error;
  }
}

// get orders for logged in user
export async function getRescueOrderById() {
  try {
    const { data } = await axiosWithAuth().get(`/api/RescueOrders`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function removeFromCart(loginId, petId) {
  const dataToSend = {
    loginId,
    petId,
  };
  console.log('data send', dataToSend);
  try {
    if (dataToSend.loginId && dataToSend.petId) {
      /* console.log(dataToSend.userId, dataToSend.productId.length); */
      const { data } = await axiosWithAuth().patch(
        `/api/cart/remove`,
        dataToSend
      );
      return data;
    }
  } catch (error) {
    throw error;
  }
}

export async function addCount(id) {
  const dataToSend = {
    id,
  };
  console.log('data send', dataToSend);
  try {
    if (dataToSend.id) {
      const { data } = await axiosWithAuth().patch(`/api/count`, dataToSend);
      return data;
    }
  } catch (error) {
    throw error;
  }
}

export async function subtractCount(id) {
  const dataToSend = {
    id,
  };
  console.log('data send', dataToSend);
  try {
    if (dataToSend.id) {
      const { data } = await axiosWithAuth().patch(
        `/api/count/subtract`,
        dataToSend
      );
      return data;
    }
  } catch (error) {
    throw error;
  }
}

export async function sendToken(total, token) {
  const dataToSend = {
    total,
    token,
  };

  console.log('data send', dataToSend);
  try {
    if (dataToSend.total && dataToSend.token) {
      const { data } = await axiosWithAuth().post(`/api/stripe`, dataToSend);
      console.log('data1', data);
      return data;
    }
  } catch (error) {
    throw error;
  }
}

export async function checkout(loginId, cartId) {
  const dataToSend = { loginId, cartId };
  console.log('data send', dataToSend);
  try {
    if (dataToSend.loginId && dataToSend.cartId) {
      const { data } = await axios.post(`/api/checkout`, dataToSend);
      console.log('data2', data);
      return data;
    }
  } catch (error) {
    throw error;
  }
}

export async function checkOrdersAndCart(loginId) {
  try {
    console.log('the id in the api: ', loginId);
    const { data } = await axiosWithAuth().get(`/api/orders/${loginId}`);
    console.log('this is the data in api returned from the server: ', data);
  } catch (error) {
    throw error;
  }
}
