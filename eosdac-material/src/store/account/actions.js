import CryptoJS from 'crypto-js'

export const importAccount = ({
  commit,
  state
}, payload) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < payload.keys.length; i++) {
      delete payload.keys[i].error
      delete payload.keys[i].errorLabel
      if (payload.keys[i].privateKey.length && payload.keys[i].key) {
        let key = payload.keys[i].privateKey
        let encrypted = encrypt(key, payload.password).toString(CryptoJS.enc.Utf8)
        payload.keys[i].privateKey = encrypted
      }
    }
    commit('IMPORT_ACCOUNT', {info: payload.info, keys: payload.keys})
    resolve()
  })
}

function encrypt (msg, pass) {
  const keySize = 256
  const iterations = 4500
  const salt = CryptoJS.lib.WordArray.random(128 / 8)
  const key = CryptoJS.PBKDF2(pass, salt, {
    iterations,
    keySize: keySize / 4
  })
  const iv = CryptoJS.lib.WordArray.random(128 / 8)
  const encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return salt.toString() + iv.toString() + encrypted.toString()
}

/* function decrypt (transitmessage, pass) {
  const keySize = 256
  const iterations = 4500
  const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32))
  const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  const encrypted = transitmessage.substring(64)
  const key = CryptoJS.PBKDF2(pass, salt, {
    iterations,
    keySize: keySize / 4
  })
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })
  return decrypted
} */
