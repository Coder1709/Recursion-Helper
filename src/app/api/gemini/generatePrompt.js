export function generatePromptFromQuestion(question) {
  return `
I have the following question:

${question}

Please provide the response in the following format with section headers:

1️⃣ Question Explanation:
Explain what the question is asking in simple terms. Make sure to clarify the context and requirements. 

2️⃣ Recursive Solution Explanation:
Describe the recursive solution step-by-ste in details using a sample input (e.g., n = 4) to illustrate how the recursion works.

3️⃣ Recursion Tree (JSON format):
Provide the recursion tree as a JSON object representing the function calls and their children.
Example:
\`\`\`json
{
  "name": "f(4)",
  "children": [
    {
      "name": "f(3)",
      "children": [...]
    },
    ...
  ]
}
\`\`\`

4️⃣ Time Complexity and Optimizations:
Explain the time complexity and any optimization strategies like memoization.Also provide me the most optimized version of the code in c++

Make sure the recursion tree JSON is well-structured so it can be parsed easily for graphical rendering.
`;
}

export function generatePromptFromCode(code) {
  return `
I have the following code:

\`\`\`javascript
${code}
\`\`\`

Please provide the response in the following format with section headers:

1️⃣ Code Explanation:
Explain what this code does in simple terms make sure to clarify the context and requirements.

2️⃣ Recursive Solution Explanation:
Describe how the recursive solution works step-by-step using a sample input (e.g., n = 4) to illustrate how the recursion works.

3️⃣ Recursion Tree (JSON format):
Provide the recursion tree as a JSON object for a sample input (e.g., n = 4) showing each function call and base case.
Example:
\`\`\`json
{
  "name": "f(4)",
  "children": [
    {
      "name": "f(3)",
      "children": [...]
    },
    ...
  ]
}
\`\`\`

4️⃣ Time Complexity and Optimizations:
Explain the time complexity and any optimization techniques like memoization. Also provide me the most optimized version of the code in c++.

Make sure the recursion tree JSON is well-structured and suitable for graphical visualization.
`;
}
