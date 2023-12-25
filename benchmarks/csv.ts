export class CSV {
  public static stringify(entries: object[]) {
    if (entries.length === 0) {
      return "";
    }

    const header = Object.keys(entries[0]).join(",");
    const rows = entries.map((obj) => Object.values(obj).join(","));

    return `${header}\n${rows.join("\n")}`;
  }
}
