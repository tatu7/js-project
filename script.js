'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let arr = [account1, account2, account3, account4];
arr.forEach(item => {
  item.username = item.owner

    .toLowerCase()
    .split(' ')
    .map(val => {
      return val[0];
    })
    .join('');
});

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////FUNCTIONS

const totalMoney = function (obj) {
  let yig = obj.movements.reduce((sum, val) => {
    return sum + val;
  }, 0);
  return yig;
};
let sumIn = 0;
let sumOut = 0;
let komisiya = 0;
const statistic = function (obj) {
  sumOut = obj.movements
    .filter(val => {
      return val < 0;
    })
    .reduce((sum, val) => {
      return sum + val;
    }, 0);
  sumIn = obj.movements
    .filter(val => {
      return val > 0;
    })
    .reduce((sum, val) => {
      return sum + val;
    }, 0);
  komisiya = obj.movements
    .filter(val => {
      return val < 0;
    })
    .map(val => {
      return (val * obj.interestRate) / 100;
    })
    .reduce((sum, val) => {
      return sum + val;
    }, 0);
};

const ektanTranzaksiya = function (obj) {
  containerMovements.innerHTML = '';
  obj.movements.forEach(item => {
    let tekshir = item > 0 ? 'deposit' : 'withdrawal';
    let html1 = `<div class="movements__row">
    <div class="movements__type movements__type--${tekshir}">2 ${tekshir}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${item}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html1);
  });
};
let kirganUser;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  let login = inputLoginUsername.value;
  let parol = Number(inputLoginPin.value);
  kirganUser = arr.find(val => {
    return val.username === login;
  });
  if (kirganUser?.pin == parol) {
    labelWelcome.textContent = `Welcome ${kirganUser.owner}`;
    containerApp.style.opacity = '1';
    labelWelcome.style.color = '#333';
  } else {
    labelWelcome.textContent = `Try again!`;
    labelWelcome.style.color = 'red';
  }
  if (!kirganUser) {
    labelWelcome.textContent = `Try again!`;
    labelWelcome.style.color = 'red';
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  ektanTranzaksiya(kirganUser);
  labelBalance.textContent = `${totalMoney(kirganUser)}€`;
  statistic(kirganUser);
  labelSumIn.textContent = sumIn;
  labelSumOut.textContent = Math.abs(sumOut);
  labelSumInterest.textContent = Math.abs(komisiya);
});
const transferMoney = function () {
  let transferSum = Number(inputTransferAmount.value);
  let transferwho = inputTransferTo.value;
  let pulOluvchi = arr.find(val => {
    return val.username === transferwho;
  });

  if (labelBalance.textContent < inputTransferAmount.value) {
    alert(
      `Sizni mablagingiz ${labelBalance.textContent}ga teng , Undan kop pulni otkaza olmaysiz`
    );
  } else {
    pulOluvchi.movements.push(transferSum);
    kirganUser.movements.push(-transferSum);
  }
};
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  transferMoney();
  ektanTranzaksiya(kirganUser);
  totalMoney(kirganUser);
  statistic(kirganUser);
  labelSumIn.textContent = sumIn;
  labelSumOut.textContent = Math.abs(sumOut);
  labelSumInterest.textContent = Math.abs(komisiya);
  labelBalance.textContent = `${totalMoney(kirganUser)}€`;
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});
let limit = Number(labelSumIn.textContent) / 10;
const requestLoan = function () {
  let qarz = Number(inputLoanAmount.value);
  if (qarz < Number(labelSumIn.textContent) / 10) {
    kirganUser.movements.push(qarz);
  } else {
    alert(
      `Siz ${
        Number(labelSumIn.textContent) / 10
      } dan kop qarz ola olmaysiz, Iltimos qayta urining!`
    );
  }
};
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  requestLoan();
  ektanTranzaksiya(kirganUser);
  totalMoney(kirganUser);
  statistic(kirganUser);
  labelSumIn.textContent = sumIn;
  labelBalance.textContent = `${totalMoney(kirganUser)}€`;
  inputLoanAmount.value = '';
});
const closeAccount = function () {
  let closeUser = inputCloseUsername.value;
  let closePin = Number(inputClosePin.value);
  if (kirganUser?.pin == closePin && kirganUser?.username === closeUser) {
    containerApp.style.opacity = '0';
  } else {
    alert('siz xato Ma`lumot kiritdingiz');
    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
};
btnClose.addEventListener('click', e => {
  e.preventDefault();
  closeAccount();
  let ochuvchi = arr.indexOf(kirganUser);
  arr.splice(ochuvchi, 1);
});
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],

  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
