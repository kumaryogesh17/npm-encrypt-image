## How to use


### Step - 1

Import the library
````
import { image } from "encrypt-image";
````
### Step - 2

Generate keys using generateKeys() function and it will return public key , private key and symmetric key.

````
const keys = image.generateKeys();
````

### Step - 3

use encrypt() function and pass the image , public key and symmetric key.

````
const encryptedImage = image.encrypt(image, keys.publicKey, keys.symmetricKey);
````

use decrypt function to get the original image , in this function just pass private key (keys.privateKey)

````
const decryptedImage = image.decrypt(keys.privateKey);
````



can store decrypted image file using writeFileSync Function
````
fs.writeFileSync('decrepted.jpg',decryptedImage);
````

## Example :

````
import { image } from "encrypt-image";
import fs from 'fs'

const keys = image.generateKeys();

const img = fs.readFileSync('image.jpg')

const encryptImage = image.encrypt(img, keys.publicKey, keys.symmetricKey);

const decryptedImage = image.decrypt(keys.privateKey);

fs.writeFileSync('dec.jpg',decryptedImage);
````