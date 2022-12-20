import crypto from 'crypto';
import fs from 'fs';

export const image = {
    generateKeys : function generateKeys()
    {
        const symmetricKey = crypto.randomBytes(256 / 8);
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048
        });

        return {
            symmetricKey,
            publicKey,
            privateKey
        }
    },

    encrypt: function encrypt(image,publicKey,symmetricKey) {
        console.log(image);
        const cipher = crypto.createCipher('aes-256-cbc', symmetricKey);
        const encryptedImage = Buffer.concat([cipher.update(image), cipher.final()]);
        const encryptedSymmetricKey = crypto.publicEncrypt(publicKey, symmetricKey);
        
        fs.writeFileSync('encrypted.bin', encryptedSymmetricKey);
        fs.appendFileSync('encrypted.bin', encryptedImage);
        return encryptedImage;

    },

    decrypt: function decrypt(privateKey) {
        const encryptedData = fs.readFileSync('encrypted.bin');
        const encryptedSymmetricKey1 = encryptedData.slice(0, 256);
        const encryptedImage1 = encryptedData.slice(256);
        const symmetricKey1 = crypto.privateDecrypt(privateKey, encryptedSymmetricKey1);

        const decipher = crypto.createDecipher('aes-256-cbc', symmetricKey1);
        const decryptedImage = Buffer.concat([decipher.update(encryptedImage1), decipher.final()]);

        // fs.writeFileSync('decrypted.png', decryptedImage);
        return decryptedImage;
    }
}
