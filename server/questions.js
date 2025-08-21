
export const QUESTION_BANK = {
  java: [
    {
      text: "Which keyword is used to inherit a class in Java?",
      options: ["implement", "extends", "inherits", "super"],
      answer: 1
    },
    {
      text: "Which collection does NOT allow duplicates?",
      options: ["List", "Set", "Map", "Queue"],
      answer: 1
    },
    {
      text: "Default value of an uninitialized int field is:",
      options: ["0", "null", "undefined", "NaN"],
      answer: 0
    },
    {
      text: "Which JVM memory area stores class metadata?",
      options: ["Heap", "Stack", "Metaspace", "Registers"],
      answer: 2
    },
    {
      text: "Which access modifier allows access within the same package?",
      options: ["private", "protected", "default (no modifier)", "public"],
      answer: 2
    },
    {
      text: "Which is functional interface in Java 8?",
      options: ["Comparator", "ArrayList", "Thread", "Collections"],
      answer: 0
    }
  ],
  cpp: [
    {
      text: "Which of the following is not a C++ access specifier?",
      options: ["private", "protected", "package", "public"],
      answer: 2
    },
    {
      text: "What does 'virtual' enable in C++?",
      options: ["Operator overloading", "Function overloading", "Runtime polymorphism", "Templates"],
      answer: 2
    },
    {
      text: "Which container is LIFO?",
      options: ["queue", "stack", "vector", "list"],
      answer: 1
    },
    {
      text: "What does RAII stand for?",
      options: ["Resource Acquisition Is Initialization", "Random Access Is Immediate", "Resource Allocation In Iteration", "Runtime Access Is Implementation"],
      answer: 0
    },
    {
      text: "Which header defines std::unique_ptr?",
      options: ["<memory>", "<utility>", "<algorithm>", "<pointer>"],
      answer: 0
    },
    {
      text: "What does 'constexpr' imply?",
      options: ["Compile-time constant", "Runtime constant", "Pointer", "Reference"],
      answer: 0
    }
  ],
  python: [
    {
      text: "Which data structure is immutable?",
      options: ["list", "dict", "set", "tuple"],
      answer: 3
    },
    {
      text: "Which keyword creates a generator?",
      options: ["yield", "return", "async", "gen"],
      answer: 0
    },
    {
      text: "PEP 8 is about:",
      options: ["Packaging", "Style guide", "Performance", "Security"],
      answer: 1
    },
    {
      text: "What does list comprehension return?",
      options: ["iterator", "list", "tuple", "set"],
      answer: 1
    },
    {
      text: "What is the output of len({1,1,2})?",
      options: ["3", "2", "1", "Error"],
      answer: 1
    },
    {
      text: "Which library is for numerical computing?",
      options: ["requests", "numpy", "flask", "pandas"],
      answer: 1
    }
  ],
  react: [
    {
      text: "Which hook manages state in a function component?",
      options: ["useState", "useEffect", "useMemo", "useRef"],
      answer: 0
    },
    {
      text: "Keys help React identify:",
      options: ["Styles", "Elements in a list", "Props", "Hooks"],
      answer: 1
    },
    {
      text: "JSX must return:",
      options: ["Multiple root nodes", "Exactly one root node", "Only <div>", "Only <span>"],
      answer: 1
    },
    {
      text: "Which hook runs after render?",
      options: ["useMemo", "useEffect", "useCallback", "useId"],
      answer: 1
    },
    {
      text: "Context provides:",
      options: ["Global CSS", "State across tree", "Router", "Animations"],
      answer: 1
    },
    {
      text: "Which library is common for routing?",
      options: ["redux", "react-router-dom", "vite", "zustand"],
      answer: 1
    }
  ],
  javascript: [
    {
      text: "typeof null is:",
      options: ["'null'", "'object'", "'undefined'", "'number'"],
      answer: 1
    },
    {
      text: "Which method adds at end of array?",
      options: ["push", "pop", "shift", "unshift"],
      answer: 0
    },
    {
      text: "Promises represent:",
      options: ["Immediate value", "Future value", "Callback", "Loop"],
      answer: 1
    },
    {
      text: "=== compares:",
      options: ["Value only", "Type only", "Value and type", "References only"],
      answer: 2
    },
    {
      text: "Which is falsy?",
      options: ["[]", "{}", "''", "'0'"],
      answer: 2
    },
    {
      text: "Array.map returns:",
      options: ["New array", "Same array", "String", "Object"],
      answer: 0
    }
  ],
  node: [
    {
      text: "Node.js is built on:",
      options: ["V8 engine", "SpiderMonkey", "Chakra", "Nashorn"],
      answer: 0
    },
    {
      text: "Which module creates server?",
      options: ["fs", "os", "http", "url"],
      answer: 2
    },
    {
      text: "npm stands for:",
      options: ["Node Package Manager", "New Project Manager", "Network Package Manager", "Node Project Module"],
      answer: 0
    },
    {
      text: "Which framework popular for Node APIs?",
      options: ["React", "Express", "Angular", "Next.js"],
      answer: 1
    },
    {
      text: "process.env is used for:",
      options: ["Environment variables", "Events", "File system", "Buffers"],
      answer: 0
    },
    {
      text: "Which method reads file async?",
      options: ["fs.readFile", "fs.readFileSync", "fs.openSync", "fs.readdirSync"],
      answer: 0
    }
  ],
  mysql: [
    {
      text: "Which SQL is used to retrieve data?",
      options: ["DELETE", "INSERT", "SELECT", "UPDATE"],
      answer: 2
    },
    {
      text: "Which clause filters rows?",
      options: ["ORDER BY", "WHERE", "GROUP BY", "HAVING"],
      answer: 1
    },
    {
      text: "Which constraint ensures uniqueness?",
      options: ["FOREIGN KEY", "UNIQUE", "CHECK", "DEFAULT"],
      answer: 1
    },
    {
      text: "What does JOIN do?",
      options: ["Merge tables", "Filter rows", "Sort rows", "Rename table"],
      answer: 0
    },
    {
      text: "Which returns number of rows?",
      options: ["COUNT(*)", "SUM()", "AVG()", "LEN()"],
      answer: 0
    },
    {
      text: "Which command creates table?",
      options: ["ALTER TABLE", "CREATE TABLE", "MAKE TABLE", "NEW TABLE"],
      answer: 1
    }
  ]
};
