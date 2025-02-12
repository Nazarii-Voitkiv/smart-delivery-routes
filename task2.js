const multiply = (a, b, c) => a * b * c;
const add = (a, b, c, d, e) => a + b + c + d + e;

const curry = (f, ...args) => 
    args.length >= f.length
        ? f(...args)
        : arg => curry(f, ...args, arg);

console.log(curry(add)(1)(2)(3)(4)(5) === add(1,2,3,4,5)); // should be true
console.log(curry(multiply)(1)(2)(3) === multiply(1,2,3)); // should be true