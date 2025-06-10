// Hardcoded questions for all 6 sections
export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  timeLimit: number;
  points: number;
  category: 'warmup' | 'general' | 'quickfire';
}

export interface SectionData {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  questions: Question[];
}

export const sectionData: Record<number, SectionData> = {
  1: {
    id: 1,
    title: "What is GitHub Copilot?",
    description: "Understanding GitHub Copilot as an AI pair programmer",
    difficulty: "beginner",
    duration: 25,
    questions: [
      {
        id: "copilot-1-1",
        question: "What is GitHub Copilot?",
        type: "multiple-choice",
        options: ["GitHub Copilot is an AI pair programmer that offers real-time code suggestions.", "GitHub Copilot is OpenAI's new autonomous agent for running end-to-end tests.", "GitHub Copilot is a Git repository hosting service built by Microsoft.", "GitHub Copilot is a package manager integrated into Visual Studio Code."],
        correctAnswer: 0,
        explanation: "GitHub Copilot is an AI pair programmer that offers real-time code suggestions to help developers write code more efficiently.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "copilot-1-2",
        question: "Which statement best describes Copilot's AI Pair Programmer role?",
        type: "multiple-choice",
        options: ["It offers context-aware, in-line code completions as you type.", "It automatically merges pull requests based on test coverage.", "It hosts live coding sessions between remote developers.", "It compiles code into optimized binaries for production."],
        correctAnswer: 0,
        explanation: "Copilot acts as an AI pair programmer by offering context-aware, in-line code completions as you type, helping you write code faster.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-1-3",
        question: "How does GitHub Copilot boost developer productivity?",
        type: "multiple-choice",
        options: ["By offloading boilerplate and repetitive coding tasks to free you for logic.", "By managing project dependencies across multiple services.", "By automatically writing system architecture documentation.", "By deploying code directly to cloud environments."],
        correctAnswer: 0,
        explanation: "GitHub Copilot boosts productivity by handling boilerplate and repetitive coding tasks, allowing developers to focus on business logic and creative problem-solving.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-1-4",
        question: "Which underlying AI model powers GitHub Copilot's code suggestions?",
        type: "multiple-choice",
        options: ["OpenAI Codex.", "Google's BERT.", "Facebook's RoBERTa.", "Microsoft's Turing-NLG."],
        correctAnswer: 0,
        explanation: "GitHub Copilot is powered by OpenAI Codex, a specialized AI model trained on code from public repositories.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-1-5",
        question: "GitHub Copilot requires which of the following to get started?",
        type: "multiple-choice",
        options: ["A valid Copilot license or free trial subscription.", "A private GitHub Enterprise Server installation.", "A one-time perpetual license purchased from the VS Code marketplace.", "No authentication—just install the VS Code extension."],
        correctAnswer: 0,
        explanation: "To use GitHub Copilot, you need a valid Copilot license or free trial subscription, which can be obtained through GitHub.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      }
    ]
  },
  
  2: {
    id: 2,
    title: "Key Features and Plans",
    description: "Exploring GitHub Copilot's features and subscription options",
    difficulty: "beginner",
    duration: 30,
    questions: [
      {
        id: "copilot-2-1",
        question: "Which feature suggests entire functions or code blocks inline?",
        type: "multiple-choice",
        options: ["Inline Code Completion.", "Copilot Chat.", "Pull Request Review.", "CLI Code Runner."],
        correctAnswer: 0,
        explanation: "Inline Code Completion is the feature that suggests entire functions or code blocks directly in your editor as you type.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "copilot-2-2",
        question: "GitHub Copilot supports approximately how many programming languages?",
        type: "multiple-choice",
        options: ["Over 70.", "Around 20.", "Exactly 50.", "Fewer than 10."],
        correctAnswer: 0,
        explanation: "GitHub Copilot supports over 70 programming languages, making it versatile for various development environments.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-2-3",
        question: "Which Copilot capability enables automatic PR reviews and Q&A within VS Code?",
        type: "multiple-choice",
        options: ["Copilot Chat.", "Inline Code Suggestions.", "Ghost Text.", "Live Share."],
        correctAnswer: 0,
        explanation: "Copilot Chat enables automatic PR reviews and Q&A functionality directly within VS Code and other supported editors.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-2-4",
        question: "Which subscription tier is designed for large organizations with policy controls and audit logs?",
        type: "multiple-choice",
        options: ["Copilot Business.", "Copilot Individual.", "Copilot Free.", "Copilot CLI."],
        correctAnswer: 0,
        explanation: "Copilot Business is designed for large organizations and includes advanced features like policy controls and audit logs.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-2-5",
        question: "What does the \"Extended Capabilities\" plan include?",
        type: "multiple-choice",
        options: ["Copilot Chat, CLI tools, and automatic code review.", "Only inline suggestions, no chat.", "A GUI for repository visualization.", "Built-in CI/CD pipelines."],
        correctAnswer: 0,
        explanation: "The Extended Capabilities plan includes Copilot Chat, CLI tools, and automatic code review features beyond basic inline suggestions.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      }
    ]
  },

  3: {
    id: 3,
    title: "Working with VS Code",
    description: "Using GitHub Copilot effectively in Visual Studio Code",
    difficulty: "intermediate",
    duration: 35,
    questions: [
      {
        id: "copilot-3-1",
        question: "What are \"ghost text\" suggestions in VS Code?",
        type: "multiple-choice",
        options: ["Light-gray, inline code completions shown as you type.", "A floating help panel with sample snippets.", "An audio narration of code changes.", "An external browser window with documentation."],
        correctAnswer: 0,
        explanation: "Ghost text suggestions are the light-gray, inline code completions that appear as you type in VS Code, showing Copilot's suggestions.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "copilot-3-2",
        question: "To accept a Copilot suggestion in VS Code, which key do you press by default?",
        type: "multiple-choice",
        options: ["Tab.", "Enter.", "Ctrl + Space.", "Esc."],
        correctAnswer: 0,
        explanation: "By default, you press the Tab key to accept a Copilot suggestion in VS Code.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-3-3",
        question: "How can you cycle through multiple Copilot suggestions?",
        type: "multiple-choice",
        options: ["Use the Copilot panel or associated keyboard shortcuts.", "Reload the VS Code window.", "Open a new file buffer.", "Press F5."],
        correctAnswer: 0,
        explanation: "You can cycle through multiple Copilot suggestions using the Copilot panel or keyboard shortcuts like Alt+] and Alt+[.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-3-4",
        question: "Copilot's adaptive suggestions rely on which of the following?",
        type: "multiple-choice",
        options: ["Context from the current file and other open files.", "Your Git commit history only.", "The default settings.json file in VS Code.", "Your system's CPU usage."],
        correctAnswer: 0,
        explanation: "Copilot's adaptive suggestions rely on context from the current file and other open files to provide relevant code completions.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-3-5",
        question: "If you don't want a suggestion, what should you do?",
        type: "multiple-choice",
        options: ["Press Esc or simply ignore it.", "Delete the entire file.", "Uninstall the Copilot extension.", "Restart VS Code."],
        correctAnswer: 0,
        explanation: "If you don't want a Copilot suggestion, you can simply press Esc to dismiss it or ignore it and continue typing.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      }
    ]
  },

  4: {
    id: 4,
    title: "Framework-Specific Support",
    description: "How GitHub Copilot works with different frameworks",
    difficulty: "intermediate",
    duration: 40,
    questions: [
      {
        id: "copilot-4-1",
        question: "In a Spring Boot app, typing @GetMapping and a method stub will most likely prompt Copilot to:",
        type: "multiple-choice",
        options: ["Suggest a complete controller method implementation.", "Generate a Dockerfile.", "Create a new JPA database schema.", "Write unit tests only."],
        correctAnswer: 0,
        explanation: "When you type @GetMapping and a method stub in Spring Boot, Copilot will suggest a complete controller method implementation based on the context.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "copilot-4-2",
        question: "Copilot can assist with Vue single-file components by generating which sections?",
        type: "multiple-choice",
        options: ["Both <template> HTML and <script> logic.", "Only CSS styles.", "Commit messages for Git.", "Package.json dependencies."],
        correctAnswer: 0,
        explanation: "Copilot can assist with Vue single-file components by generating both the <template> HTML structure and <script> logic sections.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-4-3",
        question: "What does Copilot's \"framework awareness\" enable?",
        type: "multiple-choice",
        options: ["Generating code using common APIs like Spring's @Autowired.", "Automatically updating library versions.", "Hosting your application in the cloud.", "Encrypting your source code."],
        correctAnswer: 0,
        explanation: "Framework awareness enables Copilot to generate code using common APIs and patterns specific to frameworks like Spring's @Autowired annotation.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-4-4",
        question: "For Java classes, how might you prompt Copilot to create business logic?",
        type: "multiple-choice",
        options: ["Write a comment describing the method's purpose (e.g., calculate rewards).", "Specify database connection strings.", "List all Git branches.", "Trigger a full project rebuild."],
        correctAnswer: 0,
        explanation: "You can prompt Copilot to create business logic by writing descriptive comments about the method's purpose, like '// calculate rewards'.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-4-5",
        question: "Which scenario shows Copilot's Vue assistance in action?",
        type: "multiple-choice",
        options: ["You write <!-- form with input and button --> in <template> and it scaffolds the component.", "You push to production and it auto-scales your cluster.", "It opens an external browser window for documentation.", "It converts your code to Python."],
        correctAnswer: 0,
        explanation: "Copilot's Vue assistance is demonstrated when you write HTML comments like '<!-- form with input and button -->' and it scaffolds the entire component structure.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      }
    ]
  },

  5: {
    id: 5,
    title: "Responsible Use and Limitations",
    description: "Understanding responsible AI practices with GitHub Copilot",
    difficulty: "advanced",
    duration: 45,
    questions: [
      {
        id: "copilot-5-1",
        question: "Which practice is not recommended when using Copilot?",
        type: "multiple-choice",
        options: ["Blindly trusting all suggestions without review.", "Reviewing and testing AI-generated code.", "Adding comments to note AI-assisted sections.", "Using linters and security scanners on generated code."],
        correctAnswer: 0,
        explanation: "Blindly trusting all suggestions without review is not recommended. Always review and test AI-generated code before using it in production.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "copilot-5-2",
        question: "Why should you be cautious of license issues with Copilot?",
        type: "multiple-choice",
        options: ["It may suggest code that resembles public-licensed snippets.", "It automatically applies GPL to your code.", "It encrypts all outputs.", "It refuses to suggest any code."],
        correctAnswer: 0,
        explanation: "You should be cautious because Copilot may suggest code that resembles public-licensed snippets, which could have licensing implications for your project.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-5-3",
        question: "\"You're the driver\" in Copilot usage means:",
        type: "multiple-choice",
        options: ["You remain responsible for design, architecture, and final quality.", "Copilot autonomously makes all decisions.", "You delegate code reviews entirely to Copilot.", "Copilot writes your entire README.md."],
        correctAnswer: 0,
        explanation: "'You're the driver' means you remain responsible for design decisions, architecture choices, and ensuring the final quality of your code.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-5-4",
        question: "Which is a known limitation of Copilot's context window?",
        type: "multiple-choice",
        options: ["It only \"reads\" a limited number of lines around the cursor.", "It tracks your file changes in real time.", "It remembers every file in the repository indefinitely.", "It can predict issues outside your code context."],
        correctAnswer: 0,
        explanation: "A known limitation is that Copilot only 'reads' a limited number of lines around the cursor, so it may not have complete project context.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-5-5",
        question: "What security risk might Copilot introduce if unchecked?",
        type: "multiple-choice",
        options: ["Suggesting code vulnerable to SQL injection.", "Automatically encrypting your database credentials.", "Removing all test cases.", "Blocking network access."],
        correctAnswer: 0,
        explanation: "If unchecked, Copilot might suggest code with security vulnerabilities like SQL injection, which is why code review is essential.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      }
    ]
  },

  6: {
    id: 6,
    title: "Hands-On Examples Overview",
    description: "Practical examples of using GitHub Copilot",
    difficulty: "advanced",
    duration: 50,
    questions: [
      {
        id: "copilot-6-1",
        question: "In the Java demo (\"CustomerRewards\"), you'd start by writing a comment such as // calculate reward points; Copilot will then:",
        type: "multiple-choice",
        options: ["Generate the method stub and implementation for computing points.", "Create a Docker Compose file.", "Publish the code to npm.", "Delete the class."],
        correctAnswer: 0,
        explanation: "In the Java demo, writing '// calculate reward points' prompts Copilot to generate the method stub and implementation for computing reward points.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "copilot-6-2",
        question: "For the Vue \"Feedback Form\" example, which prompt helps scaffold the component?",
        type: "multiple-choice",
        options: ["<!-- a form with an input and button --> in the <template> section.", "@GetMapping(\"/form\").", "import React from 'react'.", "docker run vuejs."],
        correctAnswer: 0,
        explanation: "For the Vue Feedback Form example, writing '<!-- a form with an input and button -->' in the <template> section helps scaffold the component.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-6-3",
        question: "What is the goal of the interactive debug scenario?",
        type: "multiple-choice",
        options: ["Show how Copilot Chat or /fix commands can diagnose and fix a bug.", "Automatically deploy the app to production.", "Convert the project to a monolithic architecture.", "Migrate the code to GitLab."],
        correctAnswer: 0,
        explanation: "The interactive debug scenario demonstrates how Copilot Chat or /fix commands can help diagnose and fix bugs in your code.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-6-4",
        question: "When generating unit tests in the demo, you'd type // test cases for the above function; Copilot will:",
        type: "multiple-choice",
        options: ["Suggest JUnit or Jest test methods covering edge cases.", "Generate a new microservice.", "Launch a browser.", "Create a Kubernetes pod."],
        correctAnswer: 0,
        explanation: "When you type '// test cases for the above function', Copilot will suggest JUnit or Jest test methods that cover various edge cases.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "copilot-6-5",
        question: "The hands-on wrap-up emphasizes that after accepting suggestions you should always:",
        type: "multiple-choice",
        options: ["Review and run tests to verify correctness.", "Immediately merge without checks.", "Delete all comments.", "Uninstall Copilot."],
        correctAnswer: 0,
        explanation: "The hands-on wrap-up emphasizes that you should always review and run tests to verify the correctness of Copilot's suggestions.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      }
    ]
  }
}; 
