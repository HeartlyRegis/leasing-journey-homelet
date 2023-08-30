const crypto = require('crypto');
const qs = require('qs');
const axios = require('axios');

const encryptWithInputs = (text, key, iv) => {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

const getEncryptText = async (applicant_id, user_id, homelet_encrypt_key) => {
    try {

        const currentDate = new Date();

        const year = currentDate.getUTCFullYear();
        const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getUTCDate()).padStart(2, '0');
        const hours = String(currentDate.getUTCHours()).padStart(2, '0');
        const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');

        const utcDateTime = `${day}${month}${year}${hours}${minutes}${seconds}`;


        const textToEncrypt = `${user_id}|${utcDateTime}`;
        // console.log('textToEncrypt:', textToEncrypt)
        // console.log('homelet_encrypt_key:', homelet_encrypt_key)
        const secretKey = Buffer.from(homelet_encrypt_key, 'utf8');  // 128-bit key
        const iv = Buffer.from(homelet_encrypt_key, 'utf8');  // Initialization Vector

        return encryptWithInputs(textToEncrypt, secretKey, iv);
    } catch (e) {
        console.error('getEncryptText', e);
        throw new Error(e);
    }

}


exports.getAccessToken = async (req, res, next) => {
    try {
        const homelet_encrypt_key = process.env.HOMELET_ENCRYPT_KEY;
        const homelet_client_id = process.env.HOMELET_CLIENT_ID;
        const homelet_onbehalfclient = process.env.HOMELET_ONBEHALFCLIENT;
        const homelet_token_end_point = process.env.HOMELET_TOKEN_END_POINT;

        const applicant_id = req.params.applicant_id;
        const user_id = req.params.user_id;

        if (!homelet_encrypt_key || !homelet_client_id || !homelet_onbehalfclient || !homelet_token_end_point) {
            return res.status(400).send({ error: 'INVALID_HOMELET_CREDENTIALS' });
        }

        const shared_secret = await getEncryptText(applicant_id, user_id, homelet_encrypt_key);

        const data = qs.stringify({
            'grant_type': 'password',
            'client_id': homelet_client_id,
            'username': shared_secret,
            'password': shared_secret,
            'onbehalfclient': homelet_onbehalfclient
        });

        const config = {
            method: 'post',
            url: homelet_token_end_point,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: data
        };

        try {
            const response = await axios(config)
            if (!(response?.data?.access_token)) {
                console.error(`Error: Invalid Homelet Access Token.`)
                return res.status(400).send({ error: 'NO_ACCESS_TOKEN' });
            }
            return res.status(200).send({ access_token: response?.data?.access_token })
        } catch (e) {
            if (e.response.status === 403) {
                console.error(`Error: Access Forbidden from Homelet. Homelet may whitelist your domain`)
                return res.status(403).send({ error: 'FORBIDDEN' });
            } else {
                console.error(`Error: ${e.response.data}`)
                return res.status(400).send({ error: e.response.data })
            }
        }

    } catch (e) {
        console.error(e)
        return res.status(400).send({ error: e.message })
    }

}