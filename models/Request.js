import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
	un: { type: String, default: 'Незарегистрированный пользователь' },
	address: { type: String, required: true },
	phone: { type: String, required: true },
	date: { type: String, required: true },
	time: { type: String, required: true },
	service: { type: String },
	customService: { type: String },
	payment: { type: String, enum: ['cash', 'card'], required: true },
	status: { type: String, default: 'В работе' },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Request', RequestSchema);
