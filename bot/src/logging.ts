import * as log from "@std/log";

export default () => {
  log.setup({
    handlers: {
      console: new log.ConsoleHandler("DEBUG", {
        formatter: log.formatters.jsonFormatter,
        useColors: false,
      }),
    },

    loggers: {
      default: {
        level: "ERROR",
        handlers: ["console"],
      },
      "fetcher.process": {
        level: "INFO",
        handlers: ["console"],
      },
      "processor.process": {
        level: "INFO",
        handlers: ["console"],
      },
      "processor.process.handler": {
        level: "INFO",
        handlers: ["console"],
      },
    },
  });
};
