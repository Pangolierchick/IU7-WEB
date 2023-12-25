import * as os from "os";

export class ResourceMonitor {
  public cpu() {
    const cpus = os.cpus();
    const cpu = cpus[0];

    const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);

    const usage = process.cpuUsage();
    const curCpuUsage = (usage.user + usage.system) / 1000;
    const perc = (curCpuUsage / total) * 100;

    return perc;
  }

  public mem() {
    return process.memoryUsage().heapUsed;
  }
}
