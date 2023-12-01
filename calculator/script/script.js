const buttons = document.querySelectorAll('button');
const display = document.querySelector('.Display')
const debug = document.querySelector('#Dbg');
const minus = document.querySelector('#Min');
const mul = document.querySelector('#Mul');
const div = document.querySelector('#Div');
const add = document.querySelector('#Add');
const mem = document.querySelector('#Mem');
const del = document.querySelector('#Del');
const sin = document.querySelector('#Sin');
const cos = document.querySelector("#Cos")

// Default Variables
Ratio = 10;
Result = 0;
Value = 0
operand = 0;
operator = 0;
decimalRatio = 1;
operandStack = [];
pi = 3.14159
opDict = {0x1:"+",0x2:"-",0x3:"x",0x4:"/"}
funcs = null;

function updateOpreand(){
    if (Ratio == 1) {
        decimalRatio = decimalRatio * 0.1;
        operand =  (operand * Ratio) + (Value * decimalRatio);
        return operand.toFixed(3)
    }
    operand =  (operand * Ratio) + (Value * decimalRatio);
    return operand;
}

// Functions
function decimalMode(){
    Value = 0;
    Ratio = 1;
}

// Algorithm Functions
function setOperator(operatorCode) {
    Ratio = 10;
    decimalRatio = 1;
    operandStack[0] = operand;
    operand = 0;
    operator = operatorCode;
    display.textContent = null;
}

function Calc(){
    operandStack[1] = operand;
    switch(operator){
        case 0x1:
            Result = operandStack[0] + operandStack[1];
            break;
        case 0x2:
            Result = operandStack[0] - operandStack[1];
            break;
        case 0x3:
            Result = operandStack[0] * operandStack[1];
            break;
        case 0x4:
            Result = operandStack[0] / operandStack[1];
            break;
    }
    display.textContent = Result;
    // reset operand stack and store ANS
    operand = Result;
    // reset Ratio
    decimalRatio = 1;
    Ratio = 10;
}


//Extend Algorithm Functions
function calcFactorial(n) {
    if (n === 1) {
        return 1;
    }
    let res = n * calcFactorial(n-1);
    return res;
}

function calcSin() {
    let sign = 1
    if (operand>180){
        rad = ((operand % 180)/180)*pi;
        sign = -1;
    }
    else{
        rad = (operand / 180) * pi;
    }
    let res = 0;
    for (let i = 1; i <= 7; i+=2) {
        if (i % 4 === 1) {
            res += (rad ** i) / calcFactorial(i);
        } else {
            res -= (rad ** i) / calcFactorial(i);
        }
    }
    res = res * sign
    display.textContent = res.toFixed(3);
    operand = res;
    return res;
}

function calcCos(){
    Result = ((1 - (calcSin(operand) ** 2))**0.5).toFixed(3);
    display.textContent = Result;
    operand = Result;
    return Result;
}

// Programmable Functions
function showMemory(){
    Memory = document.querySelector("div.Memory")
    Memory.textContent = [`Operand#1:${operandStack[0]}`,`Operand#2:${operandStack[1]}`]
    document.body.appendChild(Memory)
}
function showDebug(){
    console.log("%cDebugger",
    "background-color:red;color:white;text-align:center;border-radius:5px;padding:5px;font-weight:500")
    console.table({
        'Opreand1':operandStack[0],
        'Opreand2':operandStack[1],
        'Result':Result,
        'Operator':opDict[operator]})
}
function reset(){
    // reset all variables
    operandStack = [];
    operand = 0;
    Result = 0;
    operator = 0;
    display.textContent = null
}
function Delete(){
    operand = (operand - (operand % 10))/10;
    display.textContent = operand;
}

// UI Functions
function keyboardShortcut(e){
    switch(e.key.toLowerCase()){
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            Value = e.key;
            display.textContent = updateOpreand();
            break;
        case ".":
            decimalMode();
            break;
        case "+":
            setOperator(0x1);
            break;
        case"-":
            setOperator(0x2);
            break;
        case "*":
            setOperator(0x3);
            break;
        case "/":
            setOperator(0x4);
            break;
        case "=":
            Calc();
            break;
        case "c":
            calcCos();
            break;
        case "m":
            showMemory();
            break;
        case "d":
            showDebug();
            break;
        case "r":
            reset()
            break;
        case "s":
            calcSin()
            break;
        case "backspace":
            Delete();
            break;
    }
}

// Eventlistener
for (let i = 0;i<9;i++){
    buttons[i].addEventListener('click',()=>{
        Value = i + 1
        display.textContent = updateOpreand()
    })
}
buttons[9].addEventListener("click",decimalMode)

debug.addEventListener("click",showDebug)
add.addEventListener("click",()=>{setOperator(0x1)})
minus.addEventListener("click",()=>{setOperator(0x2)})
mul.addEventListener("click",()=>{setOperator(0x3)})
mem.addEventListener("click",showMemory)
div.addEventListener("click",()=>{setOperator(0x4)})
del.addEventListener("click",Delete)
sin.addEventListener("click",calcSin)
cos.addEventListener("click",calcCos)
buttons[11].addEventListener("click",Calc)

// Shortcut key
document.body.addEventListener("keydown",keyboardShortcut)