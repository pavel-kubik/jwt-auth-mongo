import { connectToDatabase } from './dbUtil';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export const validateJWT = async (event, callback) => {
  try {
    const token = event.headers['x-access-token'];
    if (token) {
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
      if (decodedToken) {
        //if (decodedToken.role !== 'admin') {  // TODO check roles
        const database = await connectToDatabase(process.env.MONGODB_URI);
        const collection = database.collection('user');
        const userData = await collection.findOne({
          email: decodedToken.email,
        });
        let out = null;
        try {
          out = await callback(userData);
        } catch (error) {
          console.log('Callback during JWT validate failed ' + error);
        }
        if (out) {
          return {
            statusCode: out.code,
            body: JSON.stringify(out.body),
          };
        }
      }
    }
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Not authorized',
      }),
    };
  } catch (error) {
    console.log('AUTH validate error: ' + error.message);
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Not authorized',
      }),
    };
  }
};

export const signIn = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 404 };
  }

  if (!event.body) {
    return { statusCode: 400 };
  }

  if (!process.env.TOKEN_KEY) {
    console.log(
      'MISCONFIGURATION - Missing TOKEN_KEY. Please add it to environment variables.'
    );
    return { statusCode: 500, body: 'Missing TOKEN KEY' };
  }

  const { email, password } = JSON.parse(event.body);

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection('user');

    const userData = await collection.findOne({ email: email });

    if (userData && userData.password) {
      if (await bcrypt.compare(password, userData.password)) {
        const token = jwt.sign(
          { user_id: userData._id, email }, //
          process.env.TOKEN_KEY, //
          {
            expiresIn: '7d',
          }
        );

        return {
          statusCode: 200,
          headers: {
            'x-access-token': token,
            // TODO store jwt in http only session
          },
          body: JSON.stringify({
            id: userData._id,
            username: userData.username,
            token: token,
          }),
        };
      }
    }
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Username or password is incorrect',
      }),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
};

export const signInSalt = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 404 };
  }

  if (!event.body) {
    return { statusCode: 400 };
  }

  const { email } = JSON.parse(event.body);

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection('user');

    const userData = await collection.findOne({ email: email });

    if (userData) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          salt: userData.salt,
        }),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Email not found',
      }),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
};

export const signUp = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 404 };
  }

  if (!event.body) {
    return { statusCode: 400 };
  }

  if (!process.env.TOKEN_KEY) {
    console.log(
      'MISCONFIGURATION - Missing TOKEN_KEY. Please add it to environment variables.'
    );
    return { statusCode: 500, body: 'Missing TOKEN KEY' };
  }

  const { username, email, password, salt } = JSON.parse(event.body);

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection('user');

    // TODO store IP address and allow store only few new users from same IP per time frame

    // ensure email and username unique
    const userDataByEmail = await collection.findOne({ email: email });
    if (userDataByEmail) {
      console.log('Email [' + email + '] is already used.');
      return {
        statusCode: 409,
        body: JSON.stringify({
          errorCode: 'err.emailUsed',
          message: 'Email is already used.',
        }),
      };
    }
    const userDataByUsername = await collection.findOne({ username: username });
    if (userDataByUsername) {
      console.log('Username [' + username + '] is already used.');
      return {
        statusCode: 409,
        body: JSON.stringify({
          errorCode: 'err.usernameUsed',
          message: 'Username is already used.',
        }),
      };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData = await collection.insertOne({
      username: username,
      email: email,
      password: encryptedPassword,
      salt: salt,
    });

    const token = jwt.sign(
      { user_id: userData.insertedId, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '7d',
      }
    );

    return {
      statusCode: 200,
      // TODO store jwt in http only session
      headers: {
        'x-access-token': token,
      },
      body: JSON.stringify({
        id: userData.insertedId,
        username: username,
        token: token,
      }),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
};

export const changePassword = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 404 };
  }

  if (!process.env.TOKEN_KEY) {
    console.log(
      'MISCONFIGURATION - Missing TOKEN_KEY. Please add it to environment variables.'
    );
    return { statusCode: 500, body: 'Missing TOKEN KEY' };
  }

  const { email, resetCode, salt, newPassword } = JSON.parse(event.body);
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection('user');

    const userData = await collection.findOne({ email: email });

    if (userData && userData.email === email) {
      if (userData.resetCode !== resetCode) {
        return { statusCode: 401, body: "Can't store reset code." };
      }
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      const updateResult = await collection.updateOne(
        { _id: userData._id },
        {
          $set: { salt: salt, password: encryptedPassword },
          $unset: { resetCode: 1 },
        }
      );
      if (!updateResult || updateResult.matchedCount !== 1) {
        return { statusCode: 500, body: "Can't store reset code." };
      }
      return { statusCode: 200 };
    }
    return { statusCode: 500, body: "Can't send email." };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
};

export const resetPassword = async (event, context, sendMailHandler) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 404 };
  }

  if (!process.env.TOKEN_KEY) {
    console.log(
      'MISCONFIGURATION - Missing TOKEN_KEY. Please add it to environment variables.'
    );
    return { statusCode: 500, body: 'Missing TOKEN KEY' };
  }

  const { email } = JSON.parse(event.body);
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection('user');

    const userData = await collection.findOne({ email: email });

    if (userData && userData.email === email) {
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const updateResult = await collection.updateOne(
        { _id: userData._id },
        { $set: { resetCode: resetCode } }
      );
      if (!updateResult || updateResult.matchedCount !== 1) {
        return { statusCode: 500, body: "Can't store reset code." };
      }

      if (process.env.NETLIFY_EMAILS_PROVIDER_API_KEY) {
        await sendMailHandler(email, userData.username, resetCode);
      } else {
        console.log(
          'Key NETLIFY_EMAILS_PROVIDER_API_KEY not provided. Simulate send email.'
        );
      }
      return { statusCode: 200 };
    }
    return { statusCode: 500, body: "Can't send email." };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
};
