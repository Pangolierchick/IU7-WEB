import { mkdirSync, writeFileSync } from "fs";
import { CSV } from "./csv";
import { ResourceMonitor } from "./resourceMonitor";

export interface IBenchmarkEntry {
  name: string;
  fn: (() => void) | (() => Promise<void>);
  count: number;
  isSkip: boolean;

  ranTime: number;
  ranOps: number;

  minCpu: number;
  maxCpu: number;
  avgCpu: number;

  minMem: number;
  maxMem: number;
  avgMem: number;

  skip(): IBenchmarkEntry;
}

class BenchmarkExporter {
  public static createDir() {
    try {
      mkdirSync("./benchmarkDocs");
    } catch (e) {
      return;
    }
  }
  public static toJSON(entries: IBenchmarkEntry[]) {
    const stringJson = JSON.stringify(entries);
    BenchmarkExporter.createDir();
    writeFileSync("./benchmarkDocs/benchmark.json", stringJson);
  }

  public static toCSV(entries: Partial<IBenchmarkEntry>[]) {
    const e = entries.map((v) => {
      delete v.fn;
    });
    const stringCsv = CSV.stringify(entries);
    BenchmarkExporter.createDir();
    writeFileSync("./benchmarkDocs/benchmark.csv", stringCsv);
  }
}

export class BencmarkEntry implements IBenchmarkEntry {
  constructor(
    name: string,
    fn: () => void,
    config?: { count: number; isSkip: boolean }
  ) {
    this.name = name;
    this.fn = fn;
    this.count = config?.count ?? 100;
    this.isSkip = config?.isSkip ?? false;
    this.ranTime = 0;
    this.ranOps = 0;

    this.minCpu = Infinity;
    this.maxCpu = -1;
    this.avgCpu = 0;
    this.minMem = Infinity;
    this.maxMem = -1;
    this.avgMem = 0;
  }
  minCpu: number;
  maxCpu: number;
  avgCpu: number;
  minMem: number;
  maxMem: number;
  avgMem: number;
  ranTime: number;
  ranOps: number;
  name: string;
  fn: (() => void) | (() => Promise<void>);
  count: number;
  isSkip: boolean;
  skip(): IBenchmarkEntry {
    this.isSkip = true;
    return this;
  }
}

interface IBenchRunnerConfig {
  export: boolean;
}

export class BenchRunner {
  private benchEntries: IBenchmarkEntry[] = [];
  private config: Partial<IBenchRunnerConfig>;

  constructor(config?: IBenchRunnerConfig) {
    this.config = config ?? {};
  }

  public add(name: string, fn: (() => void) | (() => Promise<void>)) {
    const entry = new BencmarkEntry(name, fn);
    this.benchEntries.push(entry);

    return entry;
  }

  private warmup(entry: IBenchmarkEntry) {
    if (!entry.isSkip) {
      for (let i = 0; i < 50; i++) {
        entry.fn();
      }
    }

    return entry;
  }

  private async runBench(entry: IBenchmarkEntry) {
    if (!entry.isSkip) {
      this.warmup(entry);

      const monitor = new ResourceMonitor();
      let avgCpu = 0;
      let avgCpiI = 0;

      let avgMem = 0;
      let avgMemI = 0;

      let ttime = 0;

      for (let i = 0; i < entry.count; i++) {
        const b = performance.now();
        await entry.fn();
        const e = performance.now();

        ttime += e - b;

        const c = monitor.cpu();

        entry.minCpu = Math.min(entry.minCpu, c);
        entry.maxCpu = Math.max(entry.maxCpu, c);

        avgCpiI++;
        avgCpu += c;

        const m = monitor.mem();

        entry.minMem = Math.min(entry.minMem, m);
        entry.maxMem = Math.max(entry.maxMem, m);

        avgMemI++;
        avgMem += m;
      }

      const time = ttime / entry.count;
      const ops = Math.floor(1 / (time / 1000));
      entry.ranTime = time;
      entry.ranOps = ops;

      entry.avgCpu = avgCpu / avgCpiI;
      entry.avgMem = avgMem / avgMemI;
    }

    return entry;
  }

  public async run() {
    const benchmarks = [];
    console.log("Beggining benchmark");
    for (const entry of this.benchEntries) {
      if (entry.isSkip) {
        console.log(`\tSkipping ${entry.name} benchmark`);
      } else {
        process.stdout.write(
          `\tRunning ${entry.name} benchmark ${entry.count} times ...`
        );
        await this.runBench(entry);

        benchmarks.push(entry);

        console.log(` ${entry.ranOps} ops/s`);
      }
    }

    if (this.config.export) {
      BenchmarkExporter.toCSV(benchmarks);
    }
  }
}
