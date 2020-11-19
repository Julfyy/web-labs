let block1 = document.getElementById('block-1');
let block2 = document.getElementById('block-2');
let block3 = document.getElementById('block-3');
let block4 = document.getElementById('block-4');
let block5 = document.getElementById('block-5');
let block6 = document.getElementById('block-6');
let inputNumber = document.getElementById('inputNumber');
let btnCalculate = document.getElementById('btnCalculate');
let btnColorRed = document.getElementById('btnColorRed');
let btnColorGreen = document.getElementById('btnColorGreen');
let btnColorBlack = document.getElementById('btnColorBlack');
let a = 12, b = 6, c = 16;

function loadColor() {
    block3.style.color = localStorage.getItem('textColor')
};

function loadChangedText(block) {
    let content = localStorage.getItem(block.id);

    if (content) {
        let backup = block.innerHTML;
        block.innerHTML = content;

        let button = document.createElement('button');
        button.textContent = 'submit';
        button.id = 'btnSubmit';
        button.onclick = () => {
            block.innerHTML = backup;
            localStorage.removeItem(block.id);
            loadRegularText(block);
        };

        block.appendChild(button);
    }
};

function loadRegularText(block) {
    let textArea = document.createElement('input');
    textArea.textContent = block.innerHTML;
    textArea.style.width = '50px';
    textArea.oninput = () => {
        localStorage.setItem(block.id, textArea.value);
    };

    block.appendChild(textArea);
};

let task1 = () => {
    let tmp = block4.outerHTML;
    block4.innerHTML = block5.outerHTML;
    block5.innerHTML = tmp;
};

let task2 = () => {
    let p = (a + b + c) / 2;
    let s = Math.sqrt(p*(p-a)*(p-b)*(p-c));
    block3.firstElementChild.getElementsByTagName('p')[0]
        .innerHTML += '<p>The area of the triangle is: ' + s + '</p>';
}

let task3 = () => {
    let cookies = document.cookie.split(';').filter(item => {
        return /num\d+=\d+/.test(item.trim());
    });
    if (cookies.length > 0) {
        block3.firstElementChild.getElementsByTagName('form')[0].style.display = 'none';
        alert(document.cookie + '\nCookies will be deleted after pressing "Ok" button');
        cookies.map(item => {
            document.cookie = 'num' + item.substring(item.indexOf('m') + 1, item.indexOf('=')) + '=;';
        });
        alert("Cookies were deleted!");
        location.reload();
    }

    btnCalculate.onclick = () => {
        let arr = [];
        let i = 0;
        let expiresAttrib = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toUTCString();
        inputNumber.value.split(' ').forEach(elem => {
            let num = Number(elem);
            let cookieString = 'num' + i + '=' + num + ';expires=' + expiresAttrib + ';path=/';
            document.cookie = cookieString;
            arr.push(num);
            i++;
        });
        alert('Min value: ' + arr.reduce((a,b)=>Math.min(a,b), Infinity));
    }
};

let task4 = () => {
    btnColorRed.onclick = () => {
        localStorage.setItem('textColor', 'red');
        loadColor();
    }
    btnColorGreen.onclick = () => {
        localStorage.setItem('textColor', 'green');
        loadColor();
    }
    btnColorBlack.onclick = () => {
        localStorage.setItem('textColor', 'black');
        loadColor();
    }
};

let task5 = () => {
    window.addEventListener('load', event => {
        loadColor();
    });    
};

let task6 = () => {
    let blocks = [block1, block2, block3, block4, block5, block6];

    blocks.forEach(block => {
        if (localStorage.getItem(block.id)) {
            loadChangedText(block);
        } else {
            loadRegularText(block);
        }
    });
};

task1();
task2();
task3();
task4();
task5();
task6();
