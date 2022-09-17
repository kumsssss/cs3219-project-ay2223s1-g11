import jsonwebtoken from "jsonwebtoken";
import 'dotenv/config'

export function verifyToken(token){
  if (!token) {
    return false;
  }
  try {
    const decoded = jsonwebtoken.verify(token, `${process.env.TOKEN_KEY}`);
    return true;
  } 
  catch (err) {
    console.log(err)
    return false
  }
}

export function createToken(username) {
    return jsonwebtoken.sign({username}, `${process.env.TOKEN_KEY}` , {expiresIn: "2h"}) 
}
