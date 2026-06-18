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
  return `${mm}-${dd} ${HH}:${MM}`;
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
