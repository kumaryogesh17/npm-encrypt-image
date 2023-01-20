import crypto from 'crypto';
import fs from 'fs';

// Encryption of Image 

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
        // console.log(image);
        const cipher = crypto.createCipher('aes-256-cbc', symmetricKey);
        const encryptedImage = Buffer.concat([cipher.update(image), cipher.final()]);
        const encryptedSymmetricKey = crypto.publicEncrypt(publicKey, symmetricKey);
        
        fs.writeFileSync('encrypted.bin', encryptedSymmetricKey);
        fs.appendFileSync('encrypted.bin', encryptedImage);
        return encryptedImage;

    },

    decrypt: function decrypt(encryptedData, privateKey) {
        // const encryptedData = fs.readFileSync('encrypted.bin');
        const encryptedSymmetricKey1 = encryptedData.slice(0, 256);
        const encryptedImage1 = encryptedData.slice(256);
        const symmetricKey1 = crypto.privateDecrypt(privateKey, encryptedSymmetricKey1);

        const decipher = crypto.createDecipher('aes-256-cbc', symmetricKey1);
        const decryptedImage = Buffer.concat([decipher.update(encryptedImage1), decipher.final()]);

        // fs.writeFileSync('decrypted.png', decryptedImage);
        return decryptedImage;
    }
}

// Encryption of Text

export const text = {

    generateKeys : function generateKeys()
    {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096
        });

        return {
            publicKey,
            privateKey
        }
    },

    encrypt : function hybridEncrypt(plaintext, publicKey) {
        // Generate a random initialization vector (IV)
        const iv = crypto.randomBytes(16);
      
        // Generate a random key for the AES algorithm
        const aesKey = crypto.randomBytes(32);
      
        // Encrypt the plaintext using the AES key and IV
        const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
      
        // Encrypt the AES key using the RSA algorithm and the given public key
        const encryptedAesKey = crypto.publicEncrypt(publicKey, aesKey);
      
        // Return the encrypted text and encrypted key as a JSON object
        return {
          iv: iv.toString('hex'),
          encrypted: encrypted,
          key: encryptedAesKey.toString('hex')
        };
      },

      decrypt : function hybridDecrypt(encrypted, privateKey) {
        // Parse the encrypted message into its components
        const iv = Buffer.from(encrypted.iv, 'hex');
        const encryptedText = encrypted.encrypted;
        const encryptedAesKey = Buffer.from(encrypted.key, 'hex');
      
        // Decrypt the AES key using the RSA algorithm and the given private key
        const aesKey = crypto.privateDecrypt(privateKey, encryptedAesKey);
      
        // Decrypt the ciphertext using the AES key and IV
        const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
      
        return decrypted;
      }

}