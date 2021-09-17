// ========== UI界面交互 ========== 

window.connected = false;//连接状态
let open = true;//开关状态
let optionsOpen = -1; //当前展开的操做的index
let maskShowStatu = false;//遮罩不展示
const imgPath = mode ? './imgs/dark/' : './imgs/light/';

// 开关
window.sleepFlag = true


// 语言模式的判断
const lang = hilink.getAppLanguageSync();
const isZhCn = lang === 'zh-CN';

// 中文切换为英文
function zhCNChangeToEN() {
  Array.from(document.querySelectorAll('[data-lang-en]')).forEach(item => {
    item.innerText = item.dataset.langEn
  })
}

// window.mode 模式 0 -> 正常模式， 1 -> dark模式
// 置灰图标合集
const disabledIcons = [
  `${imgPath}sleep-closed.png`,
  `${imgPath}wind-closed.png`,
  `${imgPath}light-closed.png`,
  `${imgPath}volume-closed.png`
]

// 开关图标合集
const onOffIcons = {
  on: `${imgPath}open.png`,
  off: `${imgPath}close.png`
}

// 哄睡激活图标
const sleepIcon = `${imgPath}sleep.png`;

// 风速激活图标合集
const windIcons = [
  `${imgPath}wind-1.png`,
  `${imgPath}wind-2.png`,
  `${imgPath}wind-3.png`,
  `${imgPath}wind-auto.png`
];

// 灯光激活图标
const lightIcon = `${imgPath}light.png`;

// 音量激活图标
const volumeIcon = `${imgPath}volume.png`;


//哄睡对象
const sleepObj = {};
sleepObj.statu = 0;//状态
sleepObj.arr = [
  { tip: '', url: disabledIcons[0] },
  { tip: isZhCn ? '已开启' : 'on', url: sleepIcon }
]//tip和icon的数组

//风速对象
const windObj = {};
windObj.statu = 0;//状态
windObj.arr = [
  { tip: '', url: disabledIcons[1] },
  { tip: isZhCn ? '1 档' : '1st gear', url: windIcons[0] },
  { tip: isZhCn ? '2 档' : '2nd gear', url: windIcons[1] },
  { tip: isZhCn ? '3 档' : '3rd gear', url: windIcons[2] },
  { tip: isZhCn ? '自动' : 'Auto', url: windIcons[3] }
]//tip和icon的数组

//灯光对象
const lightObj = {};
lightObj.statu = 0;//状态
lightObj.arr = [
  { tip: '', url: disabledIcons[2] },
  { tip: isZhCn ? '1 档' : '1st gear', url: lightIcon },
  { tip: isZhCn ? '2 档' : '2nd gear', url: lightIcon },
  { tip: isZhCn ? '3 档' : '3rd gear', url: lightIcon }
]//tip和icon的数组

//音量对象
const volumeObj = {};
volumeObj.statu = 0;//状态
volumeObj.arr = [
  { tip: '', url: disabledIcons[3] },
  { tip: isZhCn ? '1 档' : '1st gear', url: volumeIcon },
  { tip: isZhCn ? '2 档' : '2nd gear', url: volumeIcon },
  { tip: isZhCn ? '3 档' : '3rd gear', url: volumeIcon }
]//tip和icon的数组

// 连接设备
function connectToDevice() {
  toConnect();
};


// 加载完绑定事件
window.onload = function () {
  
  // 中英文切换
  !isZhCn && zhCNChangeToEN();

  // 连接设备
  connectToDevice();

  // 获取常用DOM
  window.warn = document.querySelector('.warnning'); //温度预警
  window.safewarn = document.querySelector('.safewarn') // 安全带报警
  window.safeopen = document.querySelector('.safeopen') // 安全带打开
  window.safeclose = document.querySelector('.safeclose') // 安全带关闭

  window.onOffStatu = document.querySelector('.on-off-statu');//当前的状态
  window.switchBtn = document.querySelector('.on-off-button');//开关按钮
  window.tryAgainBtn = document.querySelector('.try-again-connect-button');//重新连接按钮

  window.controllers = document.querySelector('.controllers');//包裹控制按钮的盒子
  window.tips = Array.from(document.querySelectorAll('.controller-show_tip '));//提示元素合集
  window.btns = Array.from(document.querySelectorAll('.controller-button'));//控制按钮合集
  window.optionBoxs = Array.from(document.querySelectorAll('.controller-options'));//操作box合集

  sleepObj.btn = document.querySelector('.sleep-button');//哄睡按钮
  sleepObj.tip = document.querySelector('.sleep-tip');//哄睡提示

  windObj.btn = document.querySelector('.wind-button');//风速按钮
  windObj.tip = document.querySelector('.wind-tip');//风速提示
  windObj.optionBox = document.querySelector('.wind-options');//风速操作界面
  windObj.options = Array.from(document.querySelectorAll('.wind-option'));//风速操作选项合集

  lightObj.btn = document.querySelector('.light-button');//灯光按钮
  lightObj.tip = document.querySelector('.light-tip');//灯光提示
  lightObj.optionBox = document.querySelector('.light-options');//灯光操作界面
  lightObj.options = Array.from(document.querySelectorAll('.light-option'));//灯光操作选项合集

  volumeObj.btn = document.querySelector('.volume-button');//音量按钮
  volumeObj.tip = document.querySelector('.volume-tip');//音量提示
  volumeObj.optionBox = document.querySelector('.volume-options');//音量操作界面
  volumeObj.options = Array.from(document.querySelectorAll('.volume-option'));//音量操作选项合集

  // 遮罩
  window.mask = document.querySelector('.popup-box');
  window.popup = document.querySelector('.popup-for-not-connected');

  // 稍后再试按钮
  window.connectLaterBtn = document.querySelector('.popup-for-not-connected_buttons_later');
  // 重试按钮
  window.connectAgainBtn = document.querySelector('.popup-for-not-connected_buttons_again');

  // 绑定点击事件
  // 开关
  switchBtn.addEventListener('click', switchHandler);
  tryAgainBtn.addEventListener('click', connectAgainHandler);

  // 哄睡
  sleepObj.btn.addEventListener('click', sleepHandler);

  // 风速
  windObj.btn.addEventListener('click', windHandler);
  windObj.optionBox.addEventListener('click', windOptionBoxHandler);

  // 灯光
  lightObj.btn.addEventListener('click', lightHandler);
  lightObj.optionBox.addEventListener('click', lightOptionBoxHandler);

  // 音量
  volumeObj.btn.addEventListener('click', volumeHandler);
  volumeObj.optionBox.addEventListener('click', volumeOptionBoxHandler);

  // 弹窗
  connectLaterBtn.addEventListener('click', connectLaterHandler);
  connectAgainBtn.addEventListener('click', connectAgainHandler);

  // 点击body关闭
  document.querySelector('body').addEventListener('click', closeOptionBox);
}

// 开关button的监听函数
function switchHandler() {
  if (!connected) {
    onOffStatu.innerHTML = isZhCn ? '连接中' : 'connecting';
    switchBtn.innerHTML = '';
    switchBtn.style.backgroundImage = '';
  }
  const cmd = open ? '52' : '53';
  const crc = window.getCRC(`05${cmd}${window.token}`);
  writeBLECharacteristicValue(`AA05${cmd}${window.token}${crc}55`);
}

// 哄睡button的监听函数
function sleepHandler() {
  if (!connected || !open) return;
  // 第一次播放

  if (window.sleepFlag && !window.sleepObj) {
    const crc = window.getCRC(`0849${window.token}000000`);
    writeBLECharacteristicValue(`AA0849${window.token}000000${crc}55`);

    window.sleepFlag = false
  } else {
    const id = '04';
    const songIndex = '0000';
    const crc = window.getCRC(`0849${window.token}${id}${songIndex}`);
    writeBLECharacteristicValue(`AA0849${window.token}${id}${songIndex}${crc}55`);
  }
}

// 风速button的监听函数
function windHandler() {
  if (!connected || !open) return;
  openOptions(windObj, 0);
}
// 风速操作界面监听函数
function windOptionBoxHandler(e) {
  const value = e.target.getAttribute('value');
  if (!value) return;
  const val = to02xUC(value);
  const crc = window.getCRC(`0743${window.token}00${val}`);
  writeBLECharacteristicValue(`AA0743${window.token}00${val}${crc}55`);
}

// 灯光button的监听函数
function lightHandler() {
  if (!connected || !open) return;
  openOptions(lightObj, 1);
}
// 灯光操作界面监听函数
function lightOptionBoxHandler(e) {
  const value = e.target.getAttribute('value');
  if (!value) return;
  const val = to02xUC(value);
  const crc = window.getCRC(`0747${window.token}00${val}`);
  writeBLECharacteristicValue(`AA0747${window.token}00${val}${crc}55`);
}

// 音量button的监听函数
function volumeHandler() {
  if (!connected || !open) return;
  openOptions(volumeObj, 2);
}
// 音量操作界面监听函数
function volumeOptionBoxHandler(e) {
  const value = e.target.getAttribute('value');
  if (!value) return;
  const val = to02xUC(value);
  const crc = window.getCRC(`0745${window.token}00${val}`);
  writeBLECharacteristicValue(`AA0745${window.token}00${val}${crc}55`);
}

// 弹窗，稍后再连接按钮监听函数
function connectLaterHandler() {
  maskHidden();
}

// 弹窗，立即连接按钮监听函数
function connectAgainHandler() {
  maskHidden();
  onOffStatu.innerHTML = isZhCn ? '连接中' : 'connecting';
  switchBtn.style.display = 'block';
  tryAgainBtn.style.display = 'none';
  connectToDevice();
}

// 连接成功
function successToConnect() {
  changeOnOrOff();
}

// 连接失败
function failToConnect() {
  // if (true) return;
  maskShow();
  onOffStatu.innerHTML = isZhCn ? '未连接' : 'Not connected';
  switchBtn.style.display = 'none';
  tryAgainBtn.style.display = 'block';
}

// 开关状态的样式切换
function changeOnOrOff() {
  if (open) {
    controllers.style.opacity = 1;
    onOffStatu.innerHTML = isZhCn ? '已开启' : 'Turn on';
    switchBtn.style.boxShadow = 'none';
    const url = onOffIcons.on;
    switchBtn.style.backgroundImage = `url(${url})`;
    doShowTips(open);
    toRenderControllers();

    const crc = window.getCRC(`0541${token}`);
    // 获取座椅安全带状态
    writeBLECharacteristicValue(`AA0563${token}${crc}55`);
  } else {
    controllers.style.opacity = 0.38;
    onOffStatu.innerHTML = isZhCn ? '已关闭' : 'Turn off';
    switchBtn.style.boxShadow = 'none';
    const url = onOffIcons.off;
    switchBtn.style.backgroundImage = `url(${url})`;
    doShowTips(open);
    // 如果是待机状态 所有提示隐藏
    safewarn.className = 'safewarn hidden'
    safeopen.className = 'safeopen hidden'
    safeclose.className = 'safeopen hidden'
  }
}

// 判断tip是否显示
function doShowTips(bool) {
  tips.forEach(item => {
    item.style.display = bool ? 'block' : 'none';
  })
  btns.forEach((item, index) => {
    const image = `url(${disabledIcons[index]})`;
    (item.style.backgroundImage !== image) && (item.style.backgroundImage = image);
  })
}

// 判断各控制单位的状态
function toRenderControllers() {
  // 哄睡
  selectedChangeForOptions(sleepObj);
  // 风速
  selectedChangeForOptions(windObj, 'controller-options_option wind-option');
  // 灯光
  selectedChangeForOptions(lightObj, 'controller-options_option light-option');
  // 音量
  selectedChangeForOptions(volumeObj, 'controller-options_option volume-option');
}

/**
 * @func
 * @desc 当前的操作界面的展开状态
 * @param {Object} domeObj DOM元素对象
 * @param {Number} num 当前操作界面的index值
 */
function openOptions(domObj, num) {
  const { optionBox } = domObj;
  toggleClass(optionBox, 'show');
  if ((optionsOpen === num)) {
    optionsOpen = -1;
    return;
  }
  optionBoxs[optionsOpen] && (toggleClass(optionBoxs[optionsOpen], 'show'));
  optionsOpen = num;
}

/**
 * @func
 * @desc 操作项选中状态的切换
 * @param {Object} domArr DOM元素对象
 * @param {String} className 未作处理的名字, 默认值false
*/
function selectedChangeForOptions(domObj, className = false) {
  const { btn, tip, options, arr, statu } = domObj;
  let ind = null;
  className && options.forEach((item, index) => {
    if (statu === Number(item.getAttribute('value'))) {
      ind = index;
      (item.className === className) && (item.className = item.className + ' selected');
    } else {
      (item.className !== className) && (item.className = className);
    }
  })
  ind = ind ? ind : statu;
  btn.style.backgroundImage = `url(${arr[ind].url})`;
  tip.innerHTML = arr[ind].tip;
}

// 关闭打开的操作界面
function closeOptionBox(e) {
  if (e.target.nodeName !== 'BODY' && e.target.className !== 'controller-button sleep-button') return;
  optionBoxs[optionsOpen] && (toggleClass(optionBoxs[optionsOpen], 'show'));
  optionsOpen = -1;
}

// 弹窗关闭
function maskHidden() {
  maskShowStatu = false;
  popup.className = 'popup-for-not-connected';
  mask.className = 'popup-box';
  let timer = setTimeout(() => {
    mask.style.display = 'none';
    clearTimeout(timer);
    timer = null;
  }, 500)
}

// 弹窗显示
function maskShow() {
  maskShowStatu = true;
  mask.style.display = 'block';
  setTimeout(() => {
    popup.className = 'popup-for-not-connected show';
    mask.className = 'popup-box show';
  }, 50);
}


function toggleClass(dom, name) {
  const clsName = dom.className;
  const reg = new RegExp(`\s?${name}`, 'ig');
  dom.className = clsName.includes(name) ? clsName.replace(reg, '') : `${clsName} ${name}`;
}


// ========== 连接流程 ==========

function toConnect() {
  // 监听蓝牙状态变化
  hilink.onBluetoothAdapterStateChange('onBlueToothAdapterStateChangeCallback')
  // 获取当前蓝牙模块状态
  hilink.getBluetoothAdapterState('getBlueToothAdapterStateCallback')
  // 监听连接蓝牙设备的结果
  hilink.onBLEConnectionStateChange('onBLEConnectionStateChangeCallback')
}

// 监听蓝牙状态变化的回调函数
const onBlueToothAdapterStateChangeCallback = res => {
  let data = JSON.parse(res)
  console.log('监听蓝牙状态', data)
  if (data.available) {
    // 获取当前蓝牙设备的缓存信息
    hilink.getCurrentRegisteredDevice('getCurrentRegisteredDeviceCallback')
  } else {
    hilink.openBluetoothAdapter()
  }
}

// 获取当前蓝牙模块状态的回调函数
const getBlueToothAdapterStateCallback = res => {
  let data = JSON.parse(res)
  console.log('1.蓝牙当前状态', data)
  if (data.available) {
    // 获取当前蓝牙设备的缓存信息
    hilink.getCurrentRegisteredDevice('getCurrentRegisteredDeviceCallback')
  } else {
    hilink.openBluetoothAdapter()
  }
}

// 监听连接蓝牙设备的结果
const onBLEConnectionStateChangeCallback = res => {
  const { connected } = JSON.parse(res);
  !connected && (window.connected = connected);
  console.log(connected ? '连接成功' : '连接失败');
  if (connected) {
    notifyBLECharacteristicValueChange();
  } else {
    failToConnect();
    doShowTips(false);
    switchBtn.style.boxShadow = 'none';
    switchBtn.style.backgroundImage = `url(${imgPath}loading.gif)`;
  }
}

// 获取当前蓝牙设备的缓存信息的回调函数
const getCurrentRegisteredDeviceCallback = res => {
  if (maskShowStatu) return;
  const { deviceId, errCode } = JSON.parse(res);
  if (deviceId && errCode === 0) {
    window.deviceId = deviceId
    hilink.onBluetoothDeviceFound('onBluetoothDeviceFoundCallback')
    hilink.startBluetoothDevicesDiscovery([], false, 1)
  }
}

// 监听扫描结果的回调函数
const onBluetoothDeviceFoundCallback = res => {
  const { deviceId } = JSON.parse(res)[0];
  if (window.deviceId === deviceId) {
    hilink.stopBluetoothDevicesDiscovery();
    // 建立连接
    console.log('建立连接')
    const code = hilink.createBLEConnection(deviceId);
  } else {
    console.log('尚未匹配到对应设备');
  }
}


//  ========== 通讯流程 ==========

const uuid_service = "01000100-0000-1000-8000-009078563412";
const uuid_characteristic_write = "03000300-0000-1000-8000-009278563412";
const uuid_characteristic_read = "02000200-0000-1000-8000-009178563412";
const uuid_characteristic_notify = "02000200-0000-1000-8000-009178563412";

// let readIsOk = false;

// 建立信道
function notifyBLECharacteristicValueChange() {
  console.log('信道建立...')
  hilink.onBLECharacteristicValueChange('onBLECharacteristicValueChangeCallBack');
  let status = hilink.notifyBLECharacteristicValueChange(deviceId, uuid_service, uuid_characteristic_notify, true);
  if (status !== 0) {
    notifyBLECharacteristicValueChange();
  } else {
    console.log('信道建立成功');
    const MAC = window.deviceId.split(':').join('');
    const CRC = window.getCRC(`0711${MAC}`);
    writeBLECharacteristicValue(`AA0711${MAC}${CRC}55`);
  }
}

// 对蓝牙设备发送数据
function writeBLECharacteristicValue(data) {
  hilink.writeBLECharacteristicValue(deviceId, uuid_service, uuid_characteristic_write, data, 'writeBLECharacteristicValueCallBack');
}

// 读取蓝牙设备特征值的值
// function readBLECharacteristicValue() {
//   hilink.readBLECharacteristicValue(deviceId, uuid_service, uuid_characteristic_read, 'readBLECharacteristicValueCallback')
// }

// 对蓝牙设备发送数据的回调函数
function writeBLECharacteristicValueCallBack(res) {
  let data = JSON.parse(res);
}

// 读取蓝牙设备特征值的值的回调函数
// function readBLECharacteristicValueCallback(res) {
//   if (readIsOk) return;
//   readIsOk = true;
//   let data = JSON.parse(res);
//   console.log('读取蓝牙设备特征值的值',data)
// }

// 
function onBLECharacteristicValueChangeCallBack(res) {
  const { data } = JSON.parse(res);
  if (!data) return;
  const cmd = data.substr(4, 2);
  if (CMDOBJ[cmd]) CMDOBJ[cmd](data);
}

// cmdObj
const CMDOBJ = {
  // 获取token
  '11': function (data) {
    window.token = data.substr(6, 8);
    const crc = window.getCRC(`0541${token}`);
    // 获取座椅信息
    writeBLECharacteristicValue(`AA0541${token}${crc}55`);
  },

  // 获取当前状态
  '41': function (data) {
    open = Boolean(Number(data.substr(6, 2)));
    sleepObj.statu = Number(data.substr(16, 2)) || 0;

    if (sleepObj.statu) {
      const id = '00';
      const songIndex = '0000';
      const crc = window.getCRC(`0849${window.token}${id}${songIndex}`);
      writeBLECharacteristicValue(`AA0849${window.token}${id}${songIndex}${crc}55`);
    } else {
      
    }

    windObj.statu = Number(data.substr(8, 2)) || 0;
    lightObj.statu = Number(data.substr(12, 2)) || 0;
    volumeObj.statu = Number(data.substr(10, 2)) || 0;
    window.connected = true;
    successToConnect();
  },

  // 设置风速
  '43': function (data) {
    const value = Number(data.substr(6, 2));
    windObj.statu = Number(value);
    selectedChangeForOptions(windObj, 'controller-options_option wind-option');
    windObj.optionBox.className = 'controller-options wind-options';
    optionsOpen = -1;
  },

  // 设置音量
  '45': function (data) {
    const value = Number(data.substr(6, 2));
    volumeObj.statu = Number(value);
    selectedChangeForOptions(volumeObj, 'controller-options_option volume-option');
    volumeObj.optionBox.className = 'controller-options volume-options';
    optionsOpen = -1;
  },

  // 设置灯光
  '47': function (data) {
    const value = Number(data.substr(6, 2));
    lightObj.statu = Number(value);
    selectedChangeForOptions(lightObj, 'controller-options_option light-option');
    lightObj.optionBox.className = 'controller-options light-options';
    optionsOpen = -1;
  },

  // 设置哄睡
  '49': function (data) {
    var sleepStatus = Number(data.substr(10, 2));
    if (sleepStatus == 0 || sleepStatus == 2) {
      sleepObj.statu = 0
    } else {
      sleepObj.statu = 1
    }
    selectedChangeForOptions(sleepObj);
  },

  // 温度
  '4A': function (data) {
    const preWarn = window.warnning;
    const value = parseInt(data.substr(6, 4), 16);
    const temperature = value < 32768 ? value : value - 65536;
    window.warnning = (temperature / 100) > 35;
    if (!preWarn && window.warnning) {
      warn.className = 'warnning show';
    } else if (preWarn && !window.warnning) {
      warn.className = 'warnning hidden';
    }
  },

  // 进入待机状态
  '52': function (data) {
    const statu = Boolean(Number(data.substr(6, 2)))
    open = !statu;
    changeOnOrOff();
  },

  // 退出待机状态
  '53': function (data) {
    const statu = Boolean(Number(data.substr(6, 2)))
    open = !statu;
    window.sleepFlag = true
    sleepObj.statu = 0
    changeOnOrOff();
  },
  // 监听安全带信息
  '63': function (data) {
    const statu = Boolean(Number(data.substr(6, 2)))
    // 如果是0 说明非扣上
    if (statu) {
      // 如果是true 说明扣上了
      safewarn.className = 'safewarn hidden'
      safeopen.className = 'safeopen show'
      safeclose.className = 'safeopen hidden'
    } else {
      // 如果是false 说明没扣上
      safewarn.className = 'safewarn show'
      safeopen.className = 'safeopen hidden'
      safeclose.className = 'safeopen show'
    }
  }
}