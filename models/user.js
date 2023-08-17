import { Schema, model, models } from 'mongoose';

/**
 * The 'models' object is provided by the Mongoose library and stores all the registered models.
 * 
 * If a model named 'User' already exists in the 'Model' object, it assigns that existing model to the 'User' variable.
 * 
 * This prevents redefining the model and ensures that the existing model is reused.
 * 
 * If a model named 'User' does not exist in the 'Model' object, the 'model' function from Mongoose will be called to create a new model
 * 
 * The newly created model is then assigned to the 'User' variable.

*/

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exist'],
    required: [true, 'Email is required'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      'Username invalid, it should contain 8-20 alphanumeric letters and be unique!',
    ],
  },
  image: {
    type: String,
  },
});

// if we use express server( always running), our model will be:

// const User = model('User', UserSchema
// );

// export default User;

// in NextJS we want to run the database only when needed. so we check if the database has the User schema first and only if it is not present, then create the schema.

const User = models.User || model('User', UserSchema);
export default User;
