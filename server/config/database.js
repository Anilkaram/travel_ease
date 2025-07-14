const mongoose = require('mongoose');

const DB_CONFIG = {
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    },
    connect: async () => {
        try {
            const uri = process.env.MONGO_URI;
            if (!uri) throw new Error('MONGO_URI not set');
            await mongoose.connect(uri, DB_CONFIG.options);
            console.log('MongoDB connected:', uri);
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }
};

module.exports = DB_CONFIG;