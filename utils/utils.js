// Operadores bit a bit

const repeat = (text, times) => {
    let result = '';
    while (times > 1) {
        if (times & 1) {
            result += text
        }
        times >>= 1;
        text += text;
    }
    return result + text;
    
    }
        
module.exports = {repeat};