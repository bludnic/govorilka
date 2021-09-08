import admin from 'firebase-admin';
import { NextApiHandler } from 'next';

import firebaseConfig from 'firebase.config.json';

// prevent app duplication on hot reload
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert({
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
            projectId: firebaseConfig.projectId,
        }),
    });
}

const user: NextApiHandler = async (req, res) => {
    const { authorization: idToken } = req.headers;

    if (!idToken) {
        res.status(403).json({
            message: 'Authorization header not provided',
        });
        return;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const user = await admin.auth().getUser(decodedToken.uid);

        res.status(200).json({
            ...user,
        });
    } catch (err) {
        res.status(403).json({
            message: err.message,
        });
        console.log(err);
    }
};

export default user;
