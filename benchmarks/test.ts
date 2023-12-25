import { BenchRunner } from "./runner";

const runner = new BenchRunner({ export: true });

runner.add("test #1", () => {
  const a = 0;
  const b = 123;

  const c = a + b;
});

runner
  .add("test #2", async () => {
    const a = new Promise((res) => {
      setTimeout(res, 200);
    });

    await a;
  })
  .skip();

runner.run().then();
