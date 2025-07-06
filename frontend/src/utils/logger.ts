// type LogLevel = "info" | "warn" | "error" | "log" | "success";

// interface LogEntry {
//   timestamp: string;
//   level: LogLevel;
//   message: string;
// }

// const logs: LogEntry[] = [];

// const isDev = process.env.NODE_ENV === "development";

// function getCallerLocation(): string | null {
//   const err = new Error();
//   const stack = err.stack?.split('\n') || [];
//   const callerLine = stack[3] || stack[2]; // skip current + writeLog
//   const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
//   return match ? `${match[1]}:${match[2]}` : null;
// }

// function formatDate(date: Date): string {
//   const yy = String(date.getFullYear()).slice(2);
//   const mm = String(date.getMonth() + 1).padStart(2, '0');
//   const dd = String(date.getDate()).padStart(2, '0');
//   const HH = String(date.getHours()).padStart(2, '0');
//   const MM = String(date.getMinutes()).padStart(2, '0');
//   return `${yy}-${mm}-${dd} ${HH}:${MM}`;
// }

// function formatArgs(args: any[]): string {
//   return args.map(arg => {
//     if (typeof arg === 'string') return arg;
//     try {
//       return JSON.stringify(arg);
//     } catch {
//       return String(arg);
//     }
//   }).join(' ');
// }

// // function writeLog(level: LogLevel, args: any[]) {
// //   const timestamp = formatDate(new Date());
// //   const message = formatArgs(args);

// //   const logItem: LogEntry = {
// //     timestamp: new Date().toISOString(),
// //     level,
// //     message,
// //   };

// //   logs.push(logItem);

// //   if (isDev) {
// //     const color =
// //       level === "error" ? "\x1b[31m" :
// //       level === "warn" ? "\x1b[33m" :
// //       level === "success" ? "\x1b[32m" :
// //       "\x1b[36m";

// //     console.log(`${color}[${level.toUpperCase()}] ${timestamp}: ${message}\x1b[0m`);
// //   }
// // }

// function writeLog(level: LogLevel, args: any[]) {
//   const timestamp = formatDate(new Date());
//   const message = formatArgs(args);
//   const location = (level === "error" || level === "warn") ? getCallerLocation() : null;

//   const logItem: LogEntry = {
//     timestamp: new Date().toISOString(),
//     level,
//     message: location ? `${message} (at ${location})` : message,
//   };

//   logs.push(logItem);

//   if (isDev) {
//     const color =
//       level === "error" ? "\x1b[31m" :
//       level === "warn" ? "\x1b[33m" :
//       level === "success" ? "\x1b[32m" :
//       "\x1b[36m";

//     const locationHint = location ? `\n        at ${location}` : "";
//     console.log(`${color}[${level.toUpperCase()}] ${timestamp}: ${message}${locationHint}\x1b[0m`);
//   }
// }



// function onlyLog(level: LogLevel, args: any[]) {
//   const timestamp = formatDate(new Date());
//   const message = formatArgs(args);

//   const logItem: LogEntry = {
//     timestamp,
//     level,
//     message,
//   };

//   logs.push(logItem);
// }

// // Base logging method
// function baseLogger(level: LogLevel) {
//   return (...args: any[]) => {
//     writeLog(level, args);
//   };
// }

// // Named logging function
// const log = Object.assign(baseLogger("log"), {
//   info: baseLogger("info"),
//   success: baseLogger("success"),
//   warn: baseLogger("warn"),
//   error: baseLogger("error"),
//   np: (...args: any[]) => onlyLog("log", args), // silent logging
//   infoNp: (...args: any[]) => onlyLog("info", args),
//   warnNp: (...args: any[]) => onlyLog("warn", args),
//   errorNp: (...args: any[]) => onlyLog("error", args),
// });

// export function getLogs() {
//   return logs;
// }

// export function clearLogs() {
//   logs.length = 0;
// }

// export default log;


// src/utils/logger.ts

// import { LogLevel, LogEntry } from "./types"; // Assume you have this or define inline

type LogLevel = "info" | "warn" | "error" | "log" | "success";
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

const logs: LogEntry[] = [];
const isDev = process.env.NODE_ENV === "development";

function formatDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const MM = String(date.getMinutes()).padStart(2, '0');
  return `${yy}-${mm}-${dd} ${HH}:${MM}`;
}

function formatArgs(args: any[]): string {
  return args.map(arg => {
    if (typeof arg === 'string') return arg;
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }).join(' ');
}

function getCallerTrace(): string | null {
  try {
    throw new Error();
  } catch (err: any) {
    if (!err.stack) return null;
    const lines = err.stack.split('\n');
    // Find first line that isn't internal
    const traceLine: string | undefined = lines.find((l: string) => l.includes("/src/")) || lines[3];
    return traceLine?.trim() || null;
  }
}

function writeLog(level: LogLevel, args: any[], silent = false) {
  const timestamp = formatDate(new Date());
  const message = formatArgs(args);

  const trace = level === "error" ? getCallerTrace() : null;

  const logItem: LogEntry = {
    timestamp,
    level,
    message: trace ? `${message} \n→ ${trace}` : message,
  };
  logs.push(logItem);

  if (isDev && !silent) {
    const color =
      level === "error" ? "\x1b[31m" :
      level === "warn" ? "\x1b[33m" :
      level === "success" ? "\x1b[32m" :
      "\x1b[36m";
    console.log(`${color}[${level.toUpperCase()}] ${timestamp}: ${logItem.message}\x1b[0m`);
  }
}

function onlyLog(level: LogLevel, args: any[]) {
  writeLog(level, args, true);
}

const baseLogger = (level: LogLevel) => (...args: any[]) => writeLog(level, args);

const log = Object.assign(baseLogger("log"), {
  info: baseLogger("info"),
  success: baseLogger("success"),
  warn: baseLogger("warn"),
  error: baseLogger("error"),

  np: (...args: any[]) => onlyLog("log", args),
  infoNp: (...args: any[]) => onlyLog("info", args),
  warnNp: (...args: any[]) => onlyLog("warn", args),
  errorNp: (...args: any[]) => onlyLog("error", args),
});

export function getLogs() {
  return logs;
}

export function clearLogs() {
  logs.length = 0;
}

export default log;
