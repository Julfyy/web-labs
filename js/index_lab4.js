let block1 = document.getElementById('block-1');
let block2 = document.getElementById('block-2');
let block3 = document.getElementById('block-3');
let block4 = document.getElementById('block-4');
let block5 = document.getElementById('block-5');
let block6 = document.getElementById('block-6');
let inputNumber = document.getElementById('inputNumber');
let btnCalculate = document.getElementById('btnCalculate');
let menu = document.getElementById('menu');
let blocks = [];

function addForm() {
    let form = document.createElement("form");
    let inputOwner = document.createElement('input');
    let inputRepo = document.createElement('input');
    let button = document.createElement('button');

    inputOwner.setAttribute('name', 'Owner');
    inputOwner.setAttribute('required', '');
    inputRepo.setAttribute('name', 'Repo');
    inputRepo.setAttribute('required', '');
    form.appendChild(inputOwner);
    form.appendChild(inputRepo);

    button.textContent = "Get commits!";
    form.appendChild(button);

    return {form, inputOwner, inputRepo};
};

let task1 = () => {
    let delay = 500;
    let swapContent = (index) => {
        [blocks[index].innerHTML, blocks[(index - 1) % 6].innerHTML] = 
        [blocks[(index - 1) % 6].innerHTML, blocks[index].innerHTML];
        if (index < 5) {
            delay += 500;
            setTimeout(swapContent, delay, ++index);
        }
    };

    setTimeout(swapContent, delay, 1);
};

let task5Lab3 = () => {
    window.addEventListener('load', _ => {
        blocks = [block1, block2, block3, block4, block5, block6];
        console.log("Load event");
    });    
};

let task2 = () => {
    let bgChange = () => {
        setInterval(() => {
            if (block3.style.background == 'blue') {
                block3.style.background = 'white';
            } else {
                block3.style.background = 'blue';
            }
        }, 5000);
    };
    new Promise((resolve, _) => {
        resolve(task5Lab3())
    }).then(() => {
        setTimeout(bgChange, 5000);
    });
};

let task3 = () => {
    let {form, inputOwner, inputRepo} = addForm(block3);
    block3.appendChild(form);
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let url = "https://api.github.com/repos/"+inputOwner.value+"/"+inputRepo.value+"/commits";
        
        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    let bodyError = document.getElementById('bodyError');
                    let textError = document.getElementById('textError');
                    let btnError = document.getElementById('btnError');

                    btnError.addEventListener('click', () => {
                        bodyError.style.display = 'none';
                    });

                    let str = "Error: " + res.status + " (" + res.statusText + ")";
                    textError.innerHTML = str;
                    bodyError.style.display = 'flex';
                }
                return res.json();
            })
            .then((content) => {
                content.forEach(item => {
                    let li = document.createElement('li');
                    let str = item.commit.author.name + ": " + item.commit.message;
                    li.innerHTML = str;
                    menu.appendChild(li);
                });
            });
    });
};

let c = () => {
    console.log('function 2');
};

let b = (callback) => {
    console.log('function 1');
    callback();
};

let a = (callback1, callback2) => {
    console.log("Call functions by their order");
    callback1(callback2);
};

let task4 = (callback1, callback2, callback3) => {
    callback1(callback2, callback3);
};

let quick_sort = (origArray) => {
	if (origArray.length <= 1) { 
		return origArray;
	} else {
		var left = [];
		var right = [];
		var newArray = [];
		var pivot = origArray.pop();
		var length = origArray.length;

		for (var i = 0; i < length; i++) {
			if (origArray[i] <= pivot) {
				left.push(origArray[i]);
			} else {
				right.push(origArray[i]);
			}
		}

		return newArray.concat(quick_sort(left), pivot, quick_sort(right));
	}
}

let task5 = () => {
    btnCalculate.onclick = () => {
        let enteredArray = Array.from(inputNumber.value.matchAll(/-?\d+\.?\d*/g))
            .map(elem => Number(elem));
        console.log(quick_sort(enteredArray));
        inputNumber.value = '';
    };
};

// task1();
task2();
task3();
task4(a, b, c);
task5();
