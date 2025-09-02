const expression = document.querySelector(".expression");
const answer = document.querySelector(".answer");

let equal_clicked = false;

const elements = {
    one: document.getElementById("one"),
    two: document.getElementById("two"),
    three: document.getElementById("three"),
    four: document.getElementById("four"),
    five: document.getElementById("five"),
    six: document.getElementById("six"),
    seven: document.getElementById("seven"),
    eight: document.getElementById("eight"),
    nine: document.getElementById("nine"),
    dot: document.getElementById("dot"),
    zero: document.getElementById("zero"),
    add: document.getElementById("add"),
    sub: document.getElementById("sub"),
    multiply: document.getElementById("multiply"),
    divide: document.getElementById("divide"),
};

const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const del = document.getElementById("delete");

const operators = ["+", "-", "*", "/"];
const opMap = {
    "+": "add",
    "-": "sub",
    "*": "multiply",
    "/": "divide"
};

// Numbers
for (let key of ["one","two","three","four","five","six","seven","eight","nine","zero"]) {
    elements[key].addEventListener("click", () => {
        if (equal_clicked) {
            expression.textContent = "";
            answer.textContent = "";
            equal_clicked = false;
        }
        expression.textContent += elements[key].textContent;
    });
}

// Decimal (only one per number)
elements.dot.addEventListener("click", () => {
    if (equal_clicked) {
        expression.textContent = "";
        answer.textContent = "";
        equal_clicked = false;
    }
    const currentNum = expression.textContent.split(/[\+\-\*\/]/).pop();
    if (!currentNum.includes(".")) {
        expression.textContent += ".";
    }
});

// Operators (block duplicates, allow chaining after =)
for (let op of operators) {
    elements[opMap[op]].addEventListener("click", () => {
        if (equal_clicked) {
            expression.textContent = answer.textContent; // continue from result
            answer.textContent = "";
            equal_clicked = false;
        }
        const lastChar = expression.textContent.slice(-1);
        if (!operators.includes(lastChar) && lastChar !== ".") {
            expression.textContent += op;
        }
    });
}

// Equals
equals.addEventListener("click", () => {
    if (!expression.textContent) return;

    const expr = expression.textContent;

    // Do nothing if ends with operator/decimal
    if (/[+\-*/.]$/.test(expr)) return;


    try {
        let safeExpr = expr.replace(/÷/g, "/").replace(/×/g, "*");
        let resultVal = evaluate_expression(safeExpr);

        if (!isFinite(resultVal)) {
            answer.textContent = "Error!";
        } else {
            answer.textContent = resultVal;
        }

        equal_clicked = true;
    } catch (e) {
        answer.textContent = "Error";
    }
});

// Clear
clear.addEventListener("click", () => {
    expression.textContent = "";
    answer.textContent = "";
    equal_clicked = false;
});

// Delete
del.addEventListener("click", () => {
    if (!equal_clicked) {
        expression.textContent = expression.textContent.slice(0, -1);
    }
});

function evaluate_expression(expr) {
    let expr_stack = [];
    const all_numbers = expr.split(/[\+\-\*\/]/);
    const numbers = all_numbers.map(x => Number(x));

    if (numbers.length === 1) return expr;

    let j = 0;
    for (let i = 0; i < expr.length; i++) {
        const ch = expr[i];
        if ("+-*/".includes(ch)) {
            expr_stack.push(numbers[j]);
            expr_stack.push(ch);
            j++;
        }
    }


    expr_stack.push(numbers[j]);

    let i = 0, result = [];
    
    while (i < expr_stack.length) {
        if(expr_stack[i] !== '/' && expr_stack[i] !== '*') {
            result.push(expr_stack[i]);
        } else {
            let last_val = result.pop();
            if(expr_stack[i] === '/') result.push(last_val/expr_stack[i+1]);
            else if(expr_stack[i] === '*') result.push(last_val*expr_stack[i+1]);
            i++;
        }
        i++;
    }
    if(result.length === 1)
        return result[0];

    let answer = result[0];

    i = 1;
    while (i < result.length) {
        if(result[i] === '+') answer += result[i+1];
        else answer -= result[i+1];
        i++;
        i++;
    }

    return answer;
}
