//Hex转byte
function HexStringToByte(str) {
  var len = (str.length / 2);
  var byte_array = str.split('').map(function (x) {
      return parseInt('0x' + x)
  });
  var result = [];
  for (var i = 0; i < len; i++) {
      var pos = i * 2;
      result[i] = toByte(toXChart(byte_array[pos]) << 4 | toXChart(byte_array[pos + 1]));
  }
  return result;
}

function toXChart(i) {
  return '0x' + '0123456789ABCDEF'.charAt(i);
}
//8进制补位
function toByte(curr) {

  if ((curr & 0x80) !== 0) {
      curr = Math.abs(curr) - Math.pow(2, 8)
  } else {
      curr = curr
  }
  return curr;
}

function calc_crc8(data) {
  if (data.length < 1) {
      return 0xff;
  }
  var thisbyte;
  var crc = 0xffff;
  var lastbit;

  for (var i = 0; i < data.length; i++) {
      if (data[i] < 0) {
          thisbyte = 0x100 + data[i];
      } else {
          thisbyte = data[i];
      }
      crc = crc ^ thisbyte;
      for (var shift = 1; shift <= 8; shift++) {
          lastbit = crc & 0x0001;
          crc = (crc >> 1) & 0x7fff;
          if (lastbit == 0x0001) {
              crc = crc ^ 0xa001;
          }
      }
  }
  return (crc & 0xff);
}

//十六进制%02
function to02xUC(num) {
  return ('0' + num.toString(16)).substr(-2, 2).toUpperCase()
}

function getCRC(str) {
  var hexString = HexStringToByte(str);
  return to02xUC(calc_crc8(hexString));
}
