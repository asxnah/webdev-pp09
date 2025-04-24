import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	un: { type: String, required: true, unique: true },
	pw: { type: String, required: true },
	name: { type: String, required: true },
	tel: { type: String, required: true },
	email: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;
